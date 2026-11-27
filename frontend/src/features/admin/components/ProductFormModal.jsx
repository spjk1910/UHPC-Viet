import { useEffect, useState } from 'react'

import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from '../services/adminService'

const EMPTY_PRODUCT = {
  productId: '',
  slug: '',
  productType: 'OTHER',
  productName: { en: '', vi: '' },
  shortDescription: { en: '', vi: '' },
  shortAdvantage: { en: '', vi: '' },
  description: { en: '', vi: '' },
  guide: { en: '', vi: '' },
  imageUrl: null,
  multipleVariant: false,
  selectionName: { en: '', vi: '' },
  models: [],
}

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const FIELD_CLASS = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-600'
const LOCALIZED_TEXT_FIELDS = [
  ['productName', 'Product name'],
  ['shortDescription', 'Short description'],
  ['shortAdvantage', 'Advantages (one per line)'],
  ['description', 'Description'],
  ['guide', 'Usage guide'],
]

function toEditableAdvantage(value) {
  if (Array.isArray(value)) return value.join('\n')
  if (typeof value === 'string') return value
  return value == null ? '' : JSON.stringify(value)
}

function localizedValues(value, fieldName) {
  if (value == null) return { en: '', vi: '' }
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${fieldName} must be an object with en and vi values.`)
  }
  return { en: value.en ?? '', vi: value.vi ?? '' }
}

function localizedTextValues(value, fieldName) {
  const values = localizedValues(value, fieldName)
  for (const locale of ['en', 'vi']) {
    if (values[locale] != null && typeof values[locale] !== 'string') {
      throw new Error(`${fieldName}.${locale} must be a string.`)
    }
  }
  return { en: values.en ?? '', vi: values.vi ?? '' }
}

function formatVariantValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2) ?? ''
}

function parseVariantEditorValue(value) {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function hasVariantDetails(value) {
  if (typeof value === 'string') {
    const text = value.trim()
    if (!text) return false
    if (text.startsWith('{') || text.startsWith('[')) {
      try {
        const parsed = JSON.parse(text)
        if (parsed && typeof parsed === 'object') return hasVariantDetails(parsed)
      } catch {
        return false
      }
    }
    return true
  }
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value === 'boolean') return true
  if (Array.isArray(value)) return value.some(hasVariantDetails)
  if (value && typeof value === 'object') {
    return Object.entries(value).some(([key, item]) => key.trim() && hasVariantDetails(item))
  }
  return false
}

function normalizeProductForm(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Product JSON must be an object.')
  }
  if (value.models != null && !Array.isArray(value.models)) {
    throw new Error('Product models must be an array.')
  }
  if (value.productType != null && typeof value.productType !== 'string') {
    throw new Error('Product type must be a string.')
  }
  if (value.imageUrl != null && typeof value.imageUrl !== 'string') {
    throw new Error('Image URL must be a string or null.')
  }
  if (value.multipleVariant != null && typeof value.multipleVariant !== 'boolean') {
    throw new Error('multipleVariant must be true or false.')
  }

  const advantage = localizedValues(value.shortAdvantage, 'shortAdvantage')
  return {
    ...EMPTY_PRODUCT,
    ...value,
    productId: String(value.productId ?? ''),
    slug: String(value.slug ?? ''),
    productType: String(value.productType ?? 'OTHER').toUpperCase(),
    productName: localizedTextValues(value.productName, 'productName'),
    shortDescription: localizedTextValues(value.shortDescription, 'shortDescription'),
    shortAdvantage: {
      en: toEditableAdvantage(advantage.en),
      vi: toEditableAdvantage(advantage.vi),
    },
    description: localizedTextValues(value.description, 'description'),
    guide: localizedTextValues(value.guide, 'guide'),
    imageUrl: value.imageUrl ?? null,
    multipleVariant: Boolean(value.multipleVariant),
    selectionName: localizedTextValues(value.selectionName, 'selectionName'),
    models: (value.models ?? []).map((model, index) => {
      if (!model || typeof model !== 'object' || Array.isArray(model)) {
        throw new Error(`Model ${index + 1} must be an object.`)
      }
      return {
        ...model,
        modelId: String(model.modelId ?? ''),
        productName: localizedTextValues(model.productName, `model ${index + 1} productName`),
        variant: localizedValues(model.variant, `model ${index + 1} variant`),
      }
    }),
  }
}

function toProductPayload(form) {
  const advantages = (value) => value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)

  return {
    ...form,
    shortAdvantage: {
      en: advantages(form.shortAdvantage.en),
      vi: advantages(form.shortAdvantage.vi),
    },
    imageUrl: form.imageUrl || null,
    selectionName: form.multipleVariant ? form.selectionName : null,
    models: form.multipleVariant
      ? form.models.map((model) => ({ ...model, modelId: String(model.modelId ?? '').trim() }))
      : [],
  }
}

function validateProduct(form, products, currentProduct, savedSlug) {
  const errors = {}
  const productId = String(form.productId ?? '').trim()
  const slug = String(form.slug ?? '').trim()
  const currentSlug = currentProduct?.slug ?? savedSlug
  const storedProduct = products.find((product) => product.slug === currentSlug)
  const originalProductId = currentProduct?.productId ?? storedProduct?.productId
  const otherProducts = products.filter((product) => product.slug !== currentSlug)

  if (!['SPACER', 'PANEL', 'FURNITURE', 'OTHER'].includes(form.productType)) {
    errors.productType = 'Choose a valid product type.'
  }

  if (!productId) {
    errors.productId = 'Product ID is required.'
  } else if (productId.length > 100) {
    errors.productId = 'Product ID must be 100 characters or fewer.'
  } else if (originalProductId && productId !== originalProductId) {
    errors.productId = 'Product ID cannot be changed.'
  } else if (otherProducts.some((product) => product.productId === productId)) {
    errors.productId = 'This product ID already exists.'
  }

  if (!slug) {
    errors.slug = 'URL slug is required.'
  } else if (slug.length > 255) {
    errors.slug = 'URL slug must be 255 characters or fewer.'
  } else if (otherProducts.some((product) => product.slug === slug)) {
    errors.slug = 'This URL slug already exists.'
  }

  for (const [field, label] of LOCALIZED_TEXT_FIELDS) {
    for (const locale of ['en', 'vi']) {
      if (!String(form[field]?.[locale] ?? '').trim()) {
        errors[`${field}.${locale}`] = `${label} (${locale.toUpperCase()}) is required.`
      }
    }
  }

  if (form.multipleVariant) {
    for (const locale of ['en', 'vi']) {
      if (!String(form.selectionName?.[locale] ?? '').trim()) {
        errors[`selectionName.${locale}`] = `Variant selector label (${locale.toUpperCase()}) is required.`
      }
    }
    if (form.models.length === 0) {
      errors.models = 'Add at least one variant.'
    }

    const modelIds = new Set()
    const existingModelIds = new Set(
      otherProducts.flatMap((product) => (product.models ?? []).map((model) => model.modelId)),
    )
    form.models.forEach((model, index) => {
      const modelId = String(model.modelId ?? '').trim()
      if (!modelId) {
        errors[`models.${index}.modelId`] = 'Variant ID is required.'
      } else if (modelId.length > 100) {
        errors[`models.${index}.modelId`] = 'Variant ID must be 100 characters or fewer.'
      } else if (modelIds.has(modelId) || existingModelIds.has(modelId)) {
        errors[`models.${index}.modelId`] = 'This variant ID already exists.'
      }
      modelIds.add(modelId)

      for (const field of ['productName', 'variant']) {
        for (const locale of ['en', 'vi']) {
          const fieldValue = model[field]?.[locale]
          const hasValue = field === 'variant'
            ? hasVariantDetails(fieldValue)
            : Boolean(String(fieldValue ?? '').trim())
          if (!hasValue) {
            errors[`models.${index}.${field}.${locale}`] =
              `${field === 'productName' ? 'Variant name' : 'Variant details'} (${locale.toUpperCase()}) is required.`
          }
        }
      }
    })
  }

  if (String(form.imageUrl ?? '').length > 255) {
    errors.imageUrl = 'Image URL must be 255 characters or fewer.'
  }

  return errors
}

function LocalizedField({ name, label, values, onChange, errors, multiline = false }) {
  const Field = multiline ? 'textarea' : 'input'

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {['en', 'vi'].map((locale) => {
          const error = errors[`${name}.${locale}`]
          const id = `${name}-${locale}`
          return (
            <label key={locale} className="block text-xs font-medium text-concrete" htmlFor={id}>
              {locale === 'en' ? 'English' : 'Vietnamese'}
              <Field
                id={id}
                type={multiline ? undefined : 'text'}
                rows={multiline ? 3 : undefined}
                value={values?.[locale] ?? ''}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => onChange(locale, event.target.value)}
                className={`${FIELD_CLASS} ${error ? 'border-red-500' : ''}`}
              />
              {error && <span id={`${id}-error`} className="mt-1 block text-xs text-red-700">{error}</span>}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function LocalizedVariantField({ name, values, onChange, errors }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">Variant details</legend>
      <p className="text-xs text-concrete">Enter a JSON object of specification names and values, or plain text.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {['en', 'vi'].map((locale) => {
          const error = errors[`${name}.${locale}`]
          const id = `${name}-${locale}`
          return (
            <label key={locale} className="block text-xs font-medium text-concrete" htmlFor={id}>
              {locale === 'en' ? 'English' : 'Vietnamese'}
              <textarea
                id={id}
                rows={7}
                value={formatVariantValue(values?.[locale] ?? '')}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => onChange(locale, parseVariantEditorValue(event.target.value))}
                className={`${FIELD_CLASS} font-mono ${error ? 'border-red-500' : ''}`}
              />
              {error && <span id={`${id}-error`} className="mt-1 block text-xs text-red-700">{error}</span>}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function ProductFormModal({ product, products, onClose, onSaved, onProductsChanged }) {
  const [form, setForm] = useState(() => normalizeProductForm(product ?? EMPTY_PRODUCT))
  const [jsonText, setJsonText] = useState(() => JSON.stringify(toProductPayload(normalizeProductForm(product ?? EMPTY_PRODUCT)), null, 2))
  const [jsonError, setJsonError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.imageUrl ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [savedSlug, setSavedSlug] = useState(product?.slug ?? null)
  const isEditing = Boolean(product || savedSlug)

  useEffect(() => {
    if (!imagePreview.startsWith('blob:')) return undefined
    return () => URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  function replaceForm(nextForm) {
    setForm(nextForm)
    setJsonText(JSON.stringify(toProductPayload(nextForm), null, 2))
    setJsonError('')
    setFieldErrors({})
    setError('')
  }

  function updateField(field, value) {
    replaceForm({ ...form, [field]: value })
    if (field === 'imageUrl' && !imageFile) setImagePreview(value || '')
  }

  function updateLocalizedField(field, locale, value) {
    replaceForm({
      ...form,
      [field]: { ...form[field], [locale]: value },
    })
  }

  function updateModelField(index, field, locale, value) {
    replaceForm({
      ...form,
      models: form.models.map((model, modelIndex) => (
        modelIndex === index
          ? { ...model, [field]: { ...model[field], [locale]: value } }
          : model
      )),
    })
  }

  function updateModelVariant(index, locale, value) {
    replaceForm({
      ...form,
      models: form.models.map((model, modelIndex) => (
        modelIndex === index
          ? { ...model, variant: { ...model.variant, [locale]: value } }
          : model
      )),
    })
  }

  function handleJsonChange(event) {
    const text = event.target.value
    setJsonText(text)
    setFieldErrors({})
    try {
      const nextForm = normalizeProductForm(JSON.parse(text))
      setForm(nextForm)
      if (!imageFile) setImagePreview(nextForm.imageUrl || '')
      setJsonError('')
      setError('')
    } catch (jsonParseError) {
      setJsonError(jsonParseError instanceof SyntaxError
        ? 'Enter valid JSON.'
        : jsonParseError.message)
    }
  }

  function handleJsonBlur() {
    if (jsonError) return
    setJsonText(JSON.stringify(toProductPayload(form), null, 2))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] ?? null
    setError('')
    if (file && !IMAGE_TYPES.has(file.type)) {
      setError('Choose a JPEG, PNG, or WebP image.')
      event.target.value = ''
      return
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setError('Image must be 10 MB or smaller.')
      event.target.value = ''
      return
    }

    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : form.imageUrl || '')
  }

  function applyRequestError(requestError) {
    const message = requestError.message
    const errors = {}
    if (/product id already exists/i.test(message)) {
      errors.productId = 'This product ID already exists.'
    } else if (/productid cannot be changed/i.test(message)) {
      errors.productId = 'Product ID cannot be changed.'
    } else if (/product slug already exists/i.test(message)) {
      errors.slug = 'This URL slug already exists.'
    } else if (/invalid product type/i.test(message)) {
      errors.productType = 'Choose a valid product type.'
    }
    setFieldErrors(errors)
    setError(message)
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    if (jsonError) {
      setError('Fix the JSON errors before saving.')
      return
    }

    const validationErrors = validateProduct(form, products, product, savedSlug)
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setError('Please fix the highlighted fields.')
      return
    }

    const payload = toProductPayload({
      ...form,
      productId: form.productId.trim(),
      slug: form.slug.trim(),
    })
    const previousSlug = product?.slug ?? savedSlug
    const wasEditing = Boolean(previousSlug)
    const uploadingImage = Boolean(imageFile)
    let uploadedImageUrl = ''

    setIsSaving(true)
    setSaveStatus('Saving product...')
    try {
      if (previousSlug) {
        await updateProduct(previousSlug, payload)
      } else {
        await createProduct(payload)
        setSavedSlug(payload.slug)
      }

      if (imageFile) {
        setSaveStatus('Uploading image to the configured bucket...')
        try {
          const savedProduct = await uploadProductImage(payload.slug, imageFile)
          if (!savedProduct?.imageUrl) {
            throw new Error('The upload completed without returning an image URL.')
          }
          uploadedImageUrl = savedProduct.imageUrl
          const updatedForm = { ...form, imageUrl: savedProduct.imageUrl }
          setForm(updatedForm)
          setJsonText(JSON.stringify(toProductPayload(updatedForm), null, 2))
          setImageFile(null)
          setImagePreview(savedProduct.imageUrl)
        } catch (uploadError) {
          await onProductsChanged()
          setError(`Product saved, but image upload failed: ${uploadError.message}`)
          setSavedSlug(payload.slug)
          return
        }
      }

      const message = wasEditing ? 'Product updated.' : 'Product created.'
      const imageMessage = uploadingImage
        ? ` Image uploaded to the configured bucket: ${uploadedImageUrl}`
        : form.imageUrl
          ? ' Image URL saved; no file was uploaded.'
          : ''
      await onSaved(`${message}${imageMessage}`)
    } catch (requestError) {
      applyRequestError(requestError)
    } finally {
      setIsSaving(false)
      setSaveStatus('')
    }
  }

  const productIdDisabled = Boolean(product || savedSlug)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/60 p-3 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="mx-auto my-2 flex max-h-[calc(100vh-1rem)] max-w-7xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:my-0 sm:max-h-[calc(100vh-3rem)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <h2 id="product-form-title" className="text-xl font-bold">
              {isEditing ? 'Edit product' : 'Add product'}
            </h2>
            <p className="mt-1 text-sm text-concrete">
              Fill in product details. The JSON editor on the right stays editable and synchronized.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close product form"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Close
          </button>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <form onSubmit={handleSave} className="min-h-0 space-y-5 overflow-y-auto p-5">
            {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold" htmlFor="product-id">
                Product ID
                <input
                  id="product-id"
                  required
                  disabled={productIdDisabled}
                  maxLength={100}
                  value={form.productId}
                  aria-invalid={Boolean(fieldErrors.productId)}
                  aria-describedby={fieldErrors.productId ? 'product-id-error' : undefined}
                  onChange={(event) => updateField('productId', event.target.value)}
                  className={`${FIELD_CLASS} disabled:bg-gray-100 ${fieldErrors.productId ? 'border-red-500' : ''}`}
                />
                {fieldErrors.productId && <span id="product-id-error" className="mt-1 block text-xs text-red-700">{fieldErrors.productId}</span>}
              </label>
              <label className="block text-sm font-semibold" htmlFor="product-slug">
                URL slug
                <input
                  id="product-slug"
                  required
                  maxLength={255}
                  value={form.slug}
                  aria-invalid={Boolean(fieldErrors.slug)}
                  aria-describedby={fieldErrors.slug ? 'product-slug-error' : undefined}
                  onChange={(event) => updateField('slug', event.target.value)}
                  className={`${FIELD_CLASS} ${fieldErrors.slug ? 'border-red-500' : ''}`}
                />
                {fieldErrors.slug && <span id="product-slug-error" className="mt-1 block text-xs text-red-700">{fieldErrors.slug}</span>}
              </label>
              <label className="block text-sm font-semibold sm:col-span-2" htmlFor="product-type">
                Product type
                <select
                  id="product-type"
                  value={form.productType}
                  onChange={(event) => updateField('productType', event.target.value)}
                  aria-invalid={Boolean(fieldErrors.productType)}
                  className={`${FIELD_CLASS} ${fieldErrors.productType ? 'border-red-500' : ''}`}
                >
                  <option value="SPACER">Spacer</option>
                  <option value="PANEL">Panel</option>
                  <option value="FURNITURE">Furniture</option>
                  <option value="OTHER">Other</option>
                </select>
                {fieldErrors.productType && <span className="mt-1 block text-xs text-red-700">{fieldErrors.productType}</span>}
              </label>
            </div>

            {LOCALIZED_TEXT_FIELDS.map(([field, label]) => (
              <LocalizedField
                key={field}
                name={field}
                label={field === 'shortAdvantage' ? `${label} (one per line)` : label}
                values={form[field]}
                errors={fieldErrors}
                multiline={field !== 'productName'}
                onChange={(locale, value) => updateLocalizedField(field, locale, value)}
              />
            ))}

            <div className="space-y-3">
              <label className="block text-sm font-semibold" htmlFor="product-image-url">
                Image URL (optional; link only)
                <input
                  id="product-image-url"
                  type="url"
                  value={form.imageUrl ?? ''}
                  maxLength={255}
                  aria-invalid={Boolean(fieldErrors.imageUrl)}
                  onChange={(event) => updateField('imageUrl', event.target.value || null)}
                  className={`${FIELD_CLASS} ${fieldErrors.imageUrl ? 'border-red-500' : ''}`}
                  placeholder="https://example.com/product.jpg"
                />
                {fieldErrors.imageUrl && <span className="mt-1 block text-xs text-red-700">{fieldErrors.imageUrl}</span>}
              </label>
              <label className="block text-sm font-semibold" htmlFor="product-image-file">
                Or upload an image
                <input
                  id="product-image-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="mt-2 block w-full text-sm text-concrete file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                />
                <span className="mt-1 block text-xs font-normal text-concrete">
                  Choose a file to upload it to the configured bucket. JPEG, PNG, or WebP; maximum 10 MB.
                </span>
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-40 w-full rounded-lg border border-gray-200 object-contain"
                />
              )}
            </div>

            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.multipleVariant}
                  onChange={(event) => updateField('multipleVariant', event.target.checked)}
                  className="h-4 w-4 accent-brand-600"
                />
                Product has variants
              </label>

              {form.multipleVariant && (
                <>
                  <LocalizedField
                    name="selectionName"
                    label="Variant selector label"
                    values={form.selectionName}
                    errors={fieldErrors}
                    onChange={(locale, value) => updateLocalizedField('selectionName', locale, value)}
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold">Variants</h3>
                      <button
                        type="button"
                        onClick={() => updateField('models', [
                          ...form.models,
                          { modelId: '', productName: { en: '', vi: '' }, variant: { en: '', vi: '' } },
                        ])}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
                      >
                        Add variant
                      </button>
                    </div>
                    {fieldErrors.models && <p role="alert" className="text-sm text-red-700">{fieldErrors.models}</p>}
                    {form.models.map((model, index) => (
                      <fieldset key={index} className="space-y-3 rounded-lg bg-gray-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <legend className="text-sm font-semibold">Variant {index + 1}</legend>
                          <button
                            type="button"
                            onClick={() => updateField('models', form.models.filter((_, modelIndex) => modelIndex !== index))}
                            className="text-sm font-semibold text-red-700 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <label className="block text-sm font-medium" htmlFor={`model-id-${index}`}>
                          Variant ID
                          <input
                            id={`model-id-${index}`}
                            required
                            maxLength={100}
                            value={model.modelId}
                            aria-invalid={Boolean(fieldErrors[`models.${index}.modelId`])}
                            onChange={(event) => updateField('models', form.models.map((item, modelIndex) => (
                              modelIndex === index ? { ...item, modelId: event.target.value } : item
                            )))}
                            className={`${FIELD_CLASS} ${fieldErrors[`models.${index}.modelId`] ? 'border-red-500' : ''}`}
                          />
                          {fieldErrors[`models.${index}.modelId`] && (
                            <span className="mt-1 block text-xs text-red-700">{fieldErrors[`models.${index}.modelId`]}</span>
                          )}
                        </label>
                        <LocalizedField
                          name={`models.${index}.productName`}
                          label="Variant name"
                          values={model.productName}
                          errors={fieldErrors}
                          onChange={(locale, value) => updateModelField(index, 'productName', locale, value)}
                        />
                        <LocalizedVariantField
                          name={`models.${index}.variant`}
                          values={model.variant}
                          errors={fieldErrors}
                          onChange={(locale, value) => updateModelVariant(index, locale, value)}
                        />
                      </fieldset>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 border-t border-gray-200 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {isSaving ? saveStatus : isEditing ? 'Save changes' : 'Create product'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-lg border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>

          <aside className="flex min-h-[360px] min-w-0 flex-col border-t border-gray-200 p-5 lg:border-l lg:border-t-0">
            <label className="text-sm font-semibold" htmlFor="product-json">Product JSON</label>
            <p className="mt-1 text-xs text-concrete">Edit this JSON directly; valid changes sync to the form.</p>
            {jsonError && <p role="alert" className="mt-2 text-xs text-red-700">{jsonError}</p>}
            <textarea
              id="product-json"
              value={jsonText}
              onChange={handleJsonChange}
              onBlur={handleJsonBlur}
              disabled={isSaving}
              spellCheck="false"
              aria-invalid={Boolean(jsonError)}
              className={`mt-3 min-h-[300px] w-full flex-1 resize-y rounded-lg border bg-gray-50 p-4 font-mono text-xs leading-5 outline-none focus:border-brand-600 ${jsonError ? 'border-red-500' : 'border-gray-300'}`}
            />
          </aside>
        </div>
      </section>
    </div>
  )
}

export default ProductFormModal
