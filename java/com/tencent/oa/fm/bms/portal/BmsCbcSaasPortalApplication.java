package com.tencent.oa.fm.bms.portal;

import com.tencent.oa.fm.bms.config.client.RuleService;
import com.tencent.oa.fm.bms.config.client.dto.RuleDto;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * TODO mia mia
 *
 * @Author technizhang
 * @Date 2020/12/16 18:31
 * @Version 1.0
 */
@Slf4j
@EnableFeignClients(basePackages = {"com.tencent.oa.fm.bms"})
@SpringBootApplication
public class BmsCbcSaasPortalApplication implements CommandLineRunner {


    @Autowired
    RuleService ruleService;


    public static void main(String[] args) {
        SpringApplication.run(BmsCbcSaasPortalApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        List<RuleDto> rules = ruleService.listRule("IronMan").getData();
        log.info("resp is {}", rules);
    }
}
