package com.example.InfoByte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling; // ✅ Import

@SpringBootApplication
@EnableScheduling // ✅ Enable Scheduler
@ComponentScan(basePackages = "com.example.InfoByte")
public class InfoByteApplication {

    public static void main(String[] args) {
        SpringApplication.run(InfoByteApplication.class, args);
    }
}