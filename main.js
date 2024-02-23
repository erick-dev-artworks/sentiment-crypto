const axios = require('axios');
const ta = require('technicalindicators');

var generalArray = {
    'symbol': '',
    'time': '',
    'timeUTC': '',
    'prices': {
        '1m': "",
        '3m': "",
        '15min': "",
        '30min': "",
        '45min': "",
        '1h': "",
        '3h': "",
        '4h': "",
        '12h': "",
        '1d': "",
        '3d': "",
        '5d': "",
        '1week': "" 
    },
    'percentage': {
        '1m': "",
        '3m': "",
        '15min': "",
        '30min': "",
        '45min': "",
        '1h': "",
        '3h': "",
        '4h': "",
        '12h': "",
        '1d': "",
        '3d': "",
        '5d': "",
        '1week': "" 
    }
     
}

function generateTime(time){
    var second = time % 60;
    var minute = Math.floor(time / 60) % 60;
    var hour = Math.floor(time / 3600) % 24;
    var days = Math.floor(time / 86400);

    second = (second < 10) ? '0'+second : second;
    minute = (minute < 10) ? '0'+minute : minute;
    hour = (hour < 10) ? '0'+hour : hour;
    days = (days < 10) ? '0'+ days : days;

    return days + ':' + hour + ':' + minute + ':' + second
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPrices(symbol){
    var uri = 'https://api.binance.com/api/v3/ticker/24hr?symbol=' + symbol

    var response = await axios.get(uri) 
    var rsX = {
        'symbol': response['data']['symbol'],
        'price': response['data']['lastPrice'],
        'percentChange': response['data']['priceChangePercent']
    }

    return rsX
}

var botTime = 0;

async function analyseSentiment(symbol){
    while(true){ 
        botTime++;
        D = generateTime(botTime) 
        var prices = await getPrices(symbol)

        generalArray['time'] = botTime
        generalArray['timeUTC'] = D 
        generalArray['symbol'] = symbol
        generalArray['prices']['1m'] = prices['price']; // Update 1m every second
        if (botTime % 3 === 0) { generalArray['prices']['3m'] = prices['price']; } // Update 3m every 3 seconds
        if (botTime % 15 === 0) { generalArray['prices']['15min'] = prices['price']; } // Update 15min every 15 seconds
        if (botTime % 30 === 0) { generalArray['prices']['30min'] = prices['price']; } // Update 30min every 30 seconds
        if (botTime % 45 === 0) { generalArray['prices']['45min'] = prices['price']; } // Update 45min every 45 seconds
        if (botTime % 60 === 0) { generalArray['prices']['1h'] = prices['price']; } // Update 1h every 60 seconds
        if (botTime % 180 === 0) { generalArray['prices']['3h'] = prices['price']; } // Update 3h every 180 seconds
        if (botTime % 240 === 0) { generalArray['prices']['4h'] = prices['price']; } // Update 4h every 240 seconds
        if (botTime % 720 === 0) { generalArray['prices']['12h'] = prices['price']; } // Update 12h every 720 seconds
        if (botTime % 1440 === 0) { generalArray['prices']['1d'] = prices['price']; } // Update 1d every 1440 seconds
        if (botTime % 4320 === 0) { generalArray['prices']['3d'] = prices['price']; } // Update 3d every 4320 seconds
        if (botTime % 7200 === 0) { generalArray['prices']['5d'] = prices['price']; } // Update 5d every 7200 seconds
        if (botTime % 10080 === 0) { generalArray['prices']['1week'] = prices['price']; } // Update 1week every 10080 seconds

        generalArray['percentage']['1m'] = prices['percentChange']; // Update 1m percentage every second
        if (botTime % 3 === 0) { generalArray['percentage']['3m'] = prices['percentChange']; } // Update 3m percentage every 3 seconds
        if (botTime % 15 === 0) { generalArray['percentage']['15min'] = prices['percentChange']; } // Update 15min percentage every 15 seconds
        if (botTime % 30 === 0) { generalArray['percentage']['30min'] = prices['percentChange']; } // Update 30min percentage every 30 seconds
        if (botTime % 45 === 0) { generalArray['percentage']['45min'] = prices['percentChange']; } // Update 45min percentage every 45 seconds
        if (botTime % 60 === 0) { generalArray['percentage']['1h'] = prices['percentChange']; } // Update 1h percentage every 60 seconds
        if (botTime % 180 === 0) { generalArray['percentage']['3h'] = prices['percentChange']; } // Update 3h percentage every 180 seconds
        if (botTime % 240 === 0) { generalArray['percentage']['4h'] = prices['percentChange']; } // Update 4h percentage every 240 seconds
        if (botTime % 720 === 0) { generalArray['percentage']['12h'] = prices['percentChange']; } // Update 12h percentage every 720 seconds
        if (botTime % 1440 === 0) { generalArray['percentage']['1d'] = prices['percentChange']; } // Update 1d percentage every 1440 seconds
        if (botTime % 4320 === 0) { generalArray['percentage']['3d'] = prices['percentChange']; } // Update 3d percentage every 4320 seconds
        if (botTime % 7200 === 0) { generalArray['percentage']['5d'] = prices['percentChange']; } // Update 5d percentage every 7200 seconds
        if (botTime % 10080 === 0) { generalArray['percentage']['1week'] = prices['percentChange']; } // Update 1week percentage every 10080 seconds





        console.log( generalArray)

        await sleep(60000)
    }
}

analyseSentiment('BTCUSDT');

 
async function getBinanceData(symbol, interval, limit) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await axios.get(url);
  return response.data.map(([time, open, high, low, close, volume]) => ({
    time: new Date(time),
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
    volume: parseFloat(volume),
  }));
}

async function calculateRSI(data) {
  const closes = data.map((d) => d.close).reverse();
  const rsi = ta.RSI.calculate({ values: closes, period: 14 }).reverse();
  const lastRsi = rsi[rsi.length - 1];
  const prevRsi = rsi[rsi.length - 2];
  let action, value, emotion, interpretation;

  if (lastRsi > prevRsi) {
    action = 'buy';
  } else {
    action = 'sell';
  }

  value = lastRsi.toFixed(2);
  type = 'RSI'
  if (lastRsi > 70) {
    emotion = 'positive';
    interpretation = 'The RSI value indicates that the asset is overbought and a correction may be imminent.';
  } else if (lastRsi < 30) {
    emotion = 'negative';
    interpretation = 'The RSI value indicates that the asset is oversold and a reversal may be imminent.';
  } else {
    emotion = 'neutral';
    interpretation = 'The RSI value is within the typical range for the asset and does not suggest any strong signals.';
  }

  return { type, action, value, emotion, interpretation};
}


async function calculateEMA(data, lastRsi){
    const closes = data.map((d) => d.close).reverse();

    const ema = ta.EMA.calculate({ values: closes, period: 20 }).reverse();
    const lastEma = ema[ema.length - 1];
    const prevEma = ema[ema.length - 2];
    let emaAction, emaValue, emaEmotion, emaInterpretation;
  
    if (lastEma > prevEma) {
      emaAction = 'buy';
    } else {
      emaAction = 'sell';
    }
  
    emaValue = lastEma.toFixed(2);
    emaType = 'EMA'
    if (lastEma > lastRsi) {
      emaEmotion = 'positive';
      emaInterpretation = 'The EMA value indicates that the asset is in an uptrend (recent prices).';
    } else if (lastEma < lastRsi) {
      emaEmotion = 'negative';
      emaInterpretation = 'The EMA value indicates that the asset is in a downtrend (recent pices).';
    } else {
      emaEmotion = 'neutral';
      emaInterpretation = 'The EMA value is consistent with the RSI value and does not suggest any strong signals.';
    }
  
    return { type: emaType, action: emaAction, value: emaValue, emotion: emaEmotion, interpretation: emaInterpretation};
}

async function calculateSMA(data){
    const closes = data.map((d) => d.close).reverse();
    const sma = ta.SMA.calculate({ values: closes, period: 20 }).reverse();
    const lastSma = sma[sma.length - 1];
    const prevSma = sma[sma.length - 2];
    let smaAction, smaValue, smaEmotion, smaInterpretation;

    if (lastSma > prevSma) {
        smaAction = 'buy';
    } else {
        smaAction = 'sell';
    }

    smaValue = lastSma.toFixed(2);
    smaType = 'SMA';
    if (lastSma > closes[closes.length-1]) {
        smaEmotion = 'positive';
        smaInterpretation = 'The SMA value indicates that the asset is in an uptrend (close pices).';
    } else if (lastSma < closes[closes.length-1]) {
        smaEmotion = 'negative';
        smaInterpretation = 'The SMA value indicates that the asset is in a downtrend (close pices).';
    } else {
        smaEmotion = 'neutral';
        smaInterpretation = 'The SMA value is consistent with the asset price and does not suggest any strong signals.';
    }

    return { type: smaType, action: smaAction, value: smaValue, emotion: smaEmotion, interpretation: smaInterpretation };
}


async function getTrend(data) {
  const closes = data.map((d) => d.close);
  const volumes = data.map((d) => d.volume);

  let obv = [];
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      obv.push(volumes[i]);
    } else {
      if (closes[i] > closes[i - 1]) {
        obv.push(obv[i - 1] + volumes[i]);
      } else if (closes[i] < closes[i - 1]) {
        obv.push(obv[i - 1] - volumes[i]);
      } else {
        obv.push(obv[i - 1]);
      }
    }
  }

  const lastObv = obv[obv.length - 1];
  const prevObv = obv[obv.length - 2];
  let obvAction, obvValue, obvEmotion, obvInterpretation, trend;

  if (lastObv > prevObv) {
    obvAction = "sell";
    trend = "rising";
  } else if (lastObv < prevObv) {
    obvAction = "buy";
    trend = "falling";
  } else {
    obvAction = "hold";
    trend = "neutral";
  }

  obvValue = lastObv.toFixed(2);
  obvType = "Volume Trend";
  if (trend === "rising") {
    obvEmotion = "positive";
    obvInterpretation = "The VT value indicates that the asset is in a rising trend.";
  } else if (trend === "falling") {
    obvEmotion = "negative";
    obvInterpretation = "The VT value indicates that the asset is in a falling trend.";
  } else {
    obvEmotion = "neutral";
    obvInterpretation = "The VT value does not suggest any strong signals.";
  }

  return {
    type: obvType,
    action: obvAction,
    value: obvValue,
    emotion: obvEmotion,
    interpretation: obvInterpretation
  };
}


async function getPriceTrend(data) {
  const prices = data.map((d) => d.close);

  const ema20 = ta.EMA.calculate({ period: 20, values: prices });
  const ema50 = ta.EMA.calculate({ period: 50, values: prices });
  const sma20 = ta.SMA.calculate({ period: 20, values: prices });
  const sma50 = ta.SMA.calculate({ period: 50, values: prices });

  const lastPrice = prices[prices.length - 1];
  const lastEma20 = ema20[ema20.length - 1];
  const lastEma50 = ema50[ema50.length - 1];
  const lastSma20 = sma20[sma20.length - 1];
  const lastSma50 = sma50[sma50.length - 1];

  let trendAction, trendValue, trendEmotion, trendInterpretation;

  if (lastPrice > lastEma20 && lastEma20 > lastEma50) {
    trendAction = "buy";
    trendEmotion = "positive";
    trendInterpretation = "The price is above both the 20-day EMA and 50-day EMA, indicating a bullish trend.";
  } else if (lastPrice < lastEma20 && lastEma20 < lastEma50) {
    trendAction = "sell";
    trendEmotion = "negative";
    trendInterpretation = "The price is below both the 20-day EMA and 50-day EMA, indicating a bearish trend.";
  } else {
    trendAction = "hold";
    trendEmotion = "neutral";
    trendInterpretation = "The price is between the 20-day EMA and 50-day EMA, indicating a neutral trend.";
  }

  trendValue = lastPrice.toFixed(2);
  const trendType = "Price Trend";

  return {
    type: trendType,
    action: trendAction,
    value: trendValue,
    emotion: trendEmotion,
    interpretation: trendInterpretation,
  };
}



async function calculateStrengthOfDivergence(data) {
  const prices = data.map((d) => d.close);
  const rsi = ta.RSI.calculate({ values: prices, period: 14 });

  const highestRsiIndex = rsi.indexOf(Math.max(...rsi));
  const lowestRsiIndex = rsi.indexOf(Math.min(...rsi));

  const highestPrice = prices[highestRsiIndex];
  const lowestPrice = prices[lowestRsiIndex];

  const bullishDivergence = (highestRsiIndex < lowestRsiIndex) && (highestPrice > lowestPrice);
  const bearishDivergence = (highestRsiIndex > lowestRsiIndex) && (highestPrice < lowestPrice);

  const divergenceStrength = Math.abs(highestPrice - lowestPrice) / ((highestPrice + lowestPrice) / 2) * 100;

  let action, emotion, interpretation;

  var obvType = 'Strength of Divergence'
  if (bullishDivergence) {
    action = 'buy';
    emotion = 'positive';
    interpretation = `There is a bullish divergence with a strength of ${divergenceStrength.toFixed(2)}%.`;
  } else if (bearishDivergence) {
    action = 'sell';
    emotion = 'negative';
    interpretation = `There is a bearish divergence with a strength of ${divergenceStrength.toFixed(2)}%.`;
  } else {
    action = 'hold';
    emotion = 'neutral';
    interpretation = 'There is no significant divergence present.';
  }

  return { type: obvType, action, value: (divergenceStrength).toFixed(2), emotion, interpretation };
}


async function calculateVolumeSpike(data){
  // Calculate the average volume for the period
  const volume = data.map((d) => d.volume);
  const avgVolume = volume.reduce((a, b) => a + b) / volume.length;

  // Determine if there was a volume spike (> 2 times the average volume)
  const lastVolume = volume[volume.length - 1];
  const spikeRatio = lastVolume / avgVolume;


  let action, emotion, interpretation;
  var obvType = 'Volume Spikes'
  if (spikeRatio > 2) {
    action = 'buy';
    emotion = 'positive';
    interpretation = `The last volume (${lastVolume}) is ${spikeRatio.toFixed(2)} times the average volume (${avgVolume}), indicating a potential buying opportunity.`;
  } else {
    action = 'hold';
    emotion = 'neutral';
    interpretation = 'There is no significant volume spike in this period.';
  }

  return { type: obvType, action, value: (spikeRatio).toFixed(2), emotion, interpretation };
};

function calculateSuperTrend(data) {
  const closes = data.map((d) => d.close);
  const highs = data.map((d) => d.high);
  const lows = data.map((d) => d.low);
  const atrPeriod = 10;
  const multiplier = 3;

  let superTrend = [];
  let prevSuperTrend = null;
  let prevClose = null;
  let atr = 0;

  for (let i = 0; i < data.length; i++) {
    const close = closes[i];
    const high = highs[i];
    const low = lows[i];

    if (prevClose === null) {
      atr = high - low;
    } else {
      const highDiff = Math.abs(high - prevClose);
      const lowDiff = Math.abs(low - prevClose);
      const trueRange = Math.max(high - low, highDiff, lowDiff);
      atr = (atr * (atrPeriod - 1) + trueRange) / atrPeriod;
    }

    const upperBand = (high + low) / 2 + multiplier * atr;
    const lowerBand = (high + low) / 2 - multiplier * atr;

    if (prevSuperTrend === null || prevSuperTrend === prevClose) {
      superTrend.push(upperBand);
    } else if (prevSuperTrend < prevClose && close <= upperBand) {
      superTrend.push(upperBand);
    } else if (prevSuperTrend > prevClose && close >= lowerBand) {
      superTrend.push(lowerBand);
    } else {
      superTrend.push(prevSuperTrend);
    }

    prevSuperTrend = superTrend[i];
    prevClose = close;
  }

  const lastSuperTrend = superTrend[superTrend.length - 1];

  if (typeof lastSuperTrend === 'undefined') {
    return {
      type: 'SuperTrend',
      action: 'none',
      value: '',
      emotion: '',
      interpretation: 'SuperTrend value not available',
    };
  }

  let action, value, emotion, interpretation;

  if (closes[closes.length - 1] > lastSuperTrend) {
    action = 'buy';
    emotion = 'positive';
    interpretation = 'The current price is above the SuperTrend value, indicating a bullish trend.';
  } else {
    action = 'sell';
    emotion = 'negative';
    interpretation = 'The current price is below the SuperTrend value, indicating a bearish trend.';
  }

  value = lastSuperTrend.toFixed(2);
  const type = 'SuperTrend';

  return {
    type,
    action,
    value,
    emotion,
    interpretation,
  };
}

function recognizeChartPattern(data) {
  const closes = data.map((d) => d.close);
  const opens = data.map((d) => d.open);
  const highs = data.map((d) => d.high);
  const lows = data.map((d) => d.low);
  const lastClose = closes[closes.length - 1];
  const lastIndex = highs.length - 1;

  // Bullish patterns
  if (lastClose > closes[closes.length - 2]) {
    // Bullish Engulfing pattern
    if (
      closes[closes.length - 2] < opens[opens.length - 2] &&
      lastClose > opens[opens.length - 2]
    ) {
      return {
        type: "Bullish Engulfing",
        description:
          "A bullish reversal pattern where a small bearish candle is followed by a larger bullish candle that completely engulfs the previous candle.",
      };
    }

    // Hammer pattern
    if (
      lastClose > lows[lows.length - 2] &&
      lastClose - lows[lows.length - 2] > 2 * (highs[highs.length - 2] - lastClose)
    ) {
      return {
        type: "Hammer",
        description:
          "A bullish reversal pattern where the price moves lower after the open, but then recovers to close near the high.",
      };
    }

    // Bullish Harami pattern
    if (
      closes[closes.length - 2] > opens[opens.length - 2] &&
      lastClose < opens[opens.length - 2] &&
      lastClose > closes[closes.length - 2]
    ) {
      return {
        type: "Bullish Harami",
        description:
          "A bullish reversal pattern where a small bearish candle is followed by a smaller bullish candle that is completely contained within the range of the previous candle.",
      };
    }
  }

  const leftShoulder = highs[0];
  const head = highs[1];
  const rightShoulder = highs[2];

  const neckline = (lows[0] + lows[1] + lows[2]) / 3;

  // Head & Shoulders
  const isHeadAndShoulders =
    head > leftShoulder &&
    head > rightShoulder &&
    lows[1] < neckline &&
    lows[0] < lows[1] &&
    lows[2] < lows[1];

  if (isHeadAndShoulders) {
    return {
      type: "Head and Shoulders",
      description:
        "A bearish reversal pattern that forms after a bullish trend. It is identified by a peak (the head) followed by a higher peak (the left shoulder) and then a lower peak (the right shoulder). The neckline is drawn through the lows of the two valleys, which is where the name comes from.",
    };
  }


  const maxClose = Math.max(...closes);
  const minClose = Math.min(...closes);

  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);

  const priceRange = maxHigh - minLow;
  const priceDiff = maxClose - minClose;

  const rangeToDiffRatio = priceRange / priceDiff;

  if (rangeToDiffRatio <= 0.3) {
    return {
      type: "Sideways",
      description:
        "A pattern where the price moves in a narrow range between a well-defined upper and lower bound, without any clear upward or downward trend.",
    };
  }

  // Cup and Handle pattern
  const high1 = Math.max(...highs.slice(0, Math.floor(highs.length / 2)));
  const high2 = Math.max(...highs.slice(Math.floor(highs.length / 2)));
  const low1 = Math.min(...lows.slice(0, Math.floor(lows.length / 2)));
  const low2 = Math.min(...lows.slice(Math.floor(lows.length / 2)));
  const resistance = (high1 + high2) / 2;
  const support = low2;

  if (
    high1 > high2 &&
    low1 < low2 &&
    resistance > Math.max(...highs.slice(Math.floor(highs.length / 2))) &&
    lows[lows.length - 1] > resistance
  ) {
    // Check for a "handle" shape
    const handleData = data.slice(Math.floor(data.length / 2));
    const handleHighs = handleData.map((d) => d.high);
    const handleLows = handleData.map((d) => d.low);
    const handleResistance = Math.max(...handleHighs);
    const handleSupport = Math.min(...handleLows);

    if (
      handleResistance > resistance &&
      handleLows[0] > resistance &&
      handleLows[handleLows.length - 1] > resistance &&
      handleSupport < resistance &&
      handleHighs[0] > handleResistance
    ) {
      return {
        type: "Cup and Handle",
        description:
          "A bullish continuation pattern where the price forms a 'cup' shape, followed by a 'handle' shape that retraces a portion of the cup's advance.",
        resistance,
        support,
        handleResistance,
        handleSupport,
      };
    }
  }


  if (
    highs[lastIndex] === highs[lastIndex - 2] &&
    highs[lastIndex - 1] > highs[lastIndex] &&
    lows[lastIndex - 1] > lows[lastIndex - 2] &&
    lows[lastIndex] < lows[lastIndex - 2]
  ) {
    return {
      type: "Double Top",
      description:
        "A bearish reversal pattern that forms after an uptrend. Two consecutive peaks of similar height are formed, separated by a trough, indicating that the trend may be reversing.",
    };
  }


  if (
    lows[lastIndex] === lows[lastIndex - 2] &&
    lows[lastIndex - 1] < lows[lastIndex] &&
    highs[lastIndex - 1] < highs[lastIndex - 2] &&
    highs[lastIndex] > highs[lastIndex - 2]
  ) {
    return {
      type: "Double Bottom",
      description:
        "A bullish reversal pattern that forms after a downtrend. Two consecutive troughs of similar depth are formed, separated by a peak, indicating that the trend may be reversing.",
    };
  }
  
  // Bearish patterns
  if (lastClose < closes[closes.length - 2]) {
    // Bearish Engulfing pattern
    if (
      closes[closes.length - 2] > opens[opens.length - 2] &&
      lastClose < opens[opens.length - 2]
    ) {
      return {
        type: "Bearish Engulfing",
        description:
          "A bearish reversal pattern where a small bullish candle is followed by a larger bearish candle that completely engulfs the previous candle.",
      };
    }

    // Shooting Star pattern
    if (
      lastClose < lows[lows.length - 2] &&
      lastClose - lows[lows.length - 2] > 2 * (highs[highs.length - 2] - lastClose)
    ) {
      return {
        type: "Shooting Star",
        description:
          "A bearish reversal pattern where the price moves higher after the open, but then falls to close near the low.",
      };
    }

    // Bearish Harami pattern
    if (
      closes[closes.length - 2] < opens[opens.length - 2] &&
      lastClose > opens[opens.length - 2] &&
      lastClose < closes[closes.length - 2]
    ) {
      return {
        type: "Bearish Harami",
        description:
          "A bearish reversal pattern where a small bullish candle is followed by a smaller bearish candle that is completely contained within the range of the previous candle.",
      };
    }
  }

  // No pattern detected
  return {
    type: "No pattern detected",
    description: "No recognizable chart pattern detected in the given data.",
  };
}


async function getIndicators(){
  const data = await getBinanceData('BTCUSDT', '1h', 100);


  var r1 = await calculateRSI(data)
  var r2 = await calculateEMA(data, r1['lastRsi'])
  var r3 = await calculateSMA(data)
  var r5 = await getTrend(data)
  var r6 = await calculateStrengthOfDivergence(data)
  var r7 = await calculateVolumeSpike(data)
  var r8 = await getPriceTrend(data)
  var r9 = await calculateSuperTrend(data)
  var r10 = await recognizeChartPattern(data)

  var endArray = [
    r1, 
    r2,
    r3,
    r5,
    r8,
    r6,
    r7,
    r9,
    r10
  ]

  
  console.log(endArray);

}

getIndicators()

 

function getFibLevels(prices) {
    const low = Math.min(...prices);
    const high = Math.max(...prices);
    const range = high - low;
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].map(level => low + level * range);
    return levels;
}
  
async function getFibLevelsForSymbol(symbol) {
    const intervals = ['1d', '1w', '1M'];
    const limits = [100, 52, 12];
  
    const promises = intervals.map((interval, i) => {
      const limit = limits[i];
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  
      return axios.get(url).then(response => {
        const candles = response.data;
        const prices = candles.map(candle => parseFloat(candle[4]));
        const levels = getFibLevels(prices);
  
        const lastPrice = prices[prices.length - 1];
        const closestLevel = levels.reduce((prev, curr) => {
          return (Math.abs(curr - lastPrice) < Math.abs(prev - lastPrice) ? curr : prev);
        });
        const support = closestLevel > lastPrice ? levels[levels.indexOf(closestLevel) - 1] : closestLevel;
        const resistance = closestLevel < lastPrice ? levels[levels.indexOf(closestLevel) + 1] : closestLevel;
  
        return { interval, support: support.toFixed(2), resistance: resistance.toFixed(2) };
      });
    });
  
    try {
      const results = await Promise.all(promises);
      return results;
    } catch (err) {
      return [];
    }
}
  

async function getSupports(symbol){
    try{
        var r1 = await getFibLevelsForSymbol(symbol)
      
        return r1
    } catch(e){
        return []
    }
  
}

getSupports('BTCUSDT')