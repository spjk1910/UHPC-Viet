package com.hv.uhpcviet.uhpcviet_backend;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminSecurityIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void productReadsArePublicButAdminEndpointsRequireLogin() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/products"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validAdminLoginCreatesAnAuthenticatedSession() throws Exception {
        MockHttpSession session = adminSession();

        mockMvc.perform(get("/api/admin/products").session(session))
                .andExpect(status().isOk());
    }

    @Test
    void onlyAnAuthenticatedAdminCanCreateUpdateAndDeleteProducts() throws Exception {
        CsrfDetails csrf = csrfDetails();
        String initialProduct = productJson("Admin Product", "admin-test");
        mockMvc.perform(post("/api/products")
                        .cookie(csrf.cookie())
                        .header("X-XSRF-TOKEN", csrf.token())
                        .contentType("application/json")
                        .content(initialProduct))
                .andExpect(status().isUnauthorized());

        MockHttpSession session = adminSession(csrf);
        mockMvc.perform(post("/api/products")
                        .session(session)
                        .cookie(csrf.cookie())
                        .header("X-XSRF-TOKEN", csrf.token())
                        .contentType("application/json")
                        .content(initialProduct))
                .andExpect(status().isCreated());

        mockMvc.perform(put("/api/products/admin-test")
                        .session(session)
                        .cookie(csrf.cookie())
                        .header("X-XSRF-TOKEN", csrf.token())
                        .contentType("application/json")
                        .content(productJson("Updated Admin Product", "admin-test-updated")))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/products/admin-test-updated")
                        .session(session)
                        .cookie(csrf.cookie())
                        .header("X-XSRF-TOKEN", csrf.token()))
                .andExpect(status().isNoContent());
    }

    private MockHttpSession adminSession() throws Exception {
        return adminSession(csrfDetails());
    }

    private MockHttpSession adminSession(CsrfDetails csrf) throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/admin/auth/login")
                        .cookie(csrf.cookie())
                        .header("X-XSRF-TOKEN", csrf.token())
                        .contentType("application/json")
                        .content("""
                                {"username":"test-admin","password":"test-password"}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        return (MockHttpSession) loginResult.getRequest().getSession(false);
    }

    private CsrfDetails csrfDetails() throws Exception {
        MvcResult csrfResult = mockMvc.perform(get("/api/admin/auth/csrf"))
                .andExpect(status().isOk())
                .andReturn();
        String token = csrfResult.getResponse().getContentAsString()
                .replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
        return new CsrfDetails(csrfResult.getResponse().getCookie("XSRF-TOKEN"), token);
    }

    private String productJson(String name, String slug) {
        return """
                {
                  "productId": "admin-test",
                  "slug": "%s",
                  "productType": "other",
                  "productName": {"en": "%s", "vi": "Sản phẩm quản trị"},
                  "shortDescription": {"en": "Short", "vi": "Ngắn"},
                  "shortAdvantage": {"en": "Advantage", "vi": "Ưu điểm"},
                  "description": {"en": "Description", "vi": "Mô tả"},
                  "guide": {"en": "Guide", "vi": "Hướng dẫn"},
                  "imageUrl": null,
                  "multipleVariant": false,
                  "selectionName": null,
                  "models": []
                }
                """.formatted(slug, name);
    }

    private record CsrfDetails(Cookie cookie, String token) {
    }
}
