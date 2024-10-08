/**********
* 作者：cc63&ChatGPT
* API：ipinfo.io
**********/

const url = "https://ipinfo.io/json?token=bcda261f72039f";

$httpClient.get(url, (error, response, data) => {
    if (error) {
        console.error('請求錯誤：', error);
        return $done();
    }

    try {
        const jsonData = JSON.parse(data);
        const { country, city, org: isp, ip } = jsonData;
        const emoji = getFlagEmoji(country);
        const countryCode = country; // 注意：这里countryCode和country相同，可能是一个错误？
        // 特殊处理城市名为"Hong Kong"或"Singapore"的情况
        let location = (!city || city === 'Hong Kong' || city === 'Singapore') ? `${emoji} │ ${city}` : `${emoji} ${countryCode} │ ${city}`;
        let cleanedIsp = cleanIspInfo(isp);

        const body = {
            title: "節點信息",
            content: `IP地址：${ip}\n運營商：${cleanedIsp}\n所在地：${location}`,
            icon: "globe.asia.australia",
            'icon-color': '#3D90ED'
        };

        $done(body);
    } catch (e) {
        console.error('解析錯誤：', e);
        $done();
    }
});

function getFlagEmoji(countryCode) {
    return String.fromCodePoint(...countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()));
}

function cleanIspInfo(isp) {
    return isp.replace(/\s-|\s?,|\.$|(\b(AS\d+|Hong Kong|Mass internet|Communications?|Company|information|international|Technolog(y|ies)|ESolutions?|Services Limited)\b|\(.*\))\s?|munications?/gi, '');
}
