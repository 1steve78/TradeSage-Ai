export const calculateSMA = ( candles,period) =>{
    const result = [];

    for(let i = period -1 ; i <candles.length ;i++){
        let sum =0;

        for(let j = i-period +1 ; j<= i ;j++){
            sum += candles[j].close;
        }

        result.push({
            time : candles[i].time,
            value : Number((sum/period).toFixed(2)),
        });
    }
    return result;
};

export const calculateEMA = (candles,period) => {
    const multiplier = 2/(period +1);

    const ema = [];

    let previous = candles[0].close;

    candles.forEach((candle) =>{
        previous = candle.close *multiplier + previous*(1-multiplier);

        ema.push({
            time: candle.time ,
            value : Number(
                previous.toFixed(2)
            ),
        });
    });
    return ema;
};