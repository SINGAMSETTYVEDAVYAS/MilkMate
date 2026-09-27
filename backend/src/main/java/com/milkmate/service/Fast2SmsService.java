package com.milkmate.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Fast2SmsService {

    @Value("${fast2sms.api.key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendSms(
            String mobile,
            String message) {

        try {

            String jsonBody =
                    "{"
                    + "\"route\":\"q\","
                    + "\"message\":\""
                    + message.replace("\"", "\\\"")
                    + "\","
                    + "\"numbers\":\""
                    + mobile
                    + "\""
                    + "}";

            HttpRequest request =
                    HttpRequest.newBuilder()
                    .uri(
                        URI.create(
                            "https://www.fast2sms.com/dev/bulkV2"
                        )
                    )
                    .header(
                        "Authorization",
                        apiKey
                    )
                    .header(
                        "Content-Type",
                        "application/json"
                    )
                    .POST(
                        HttpRequest.BodyPublishers.ofString(
                            jsonBody
                        )
                    )
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                    );

            System.out.println(
                    "Fast2SMS Response: "
                    + response.body()
            );

        } catch (Exception error) {

            System.out.println(
                    "SMS sending failed: "
                    + error.getMessage()
            );
        }
    }
}