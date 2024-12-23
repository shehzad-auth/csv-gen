/*'use client';
import { useState } from 'react';
import { CRYPTO_FILES } from './file_names';


const ProcessingStatus = ({ currentChunk, totalChunks }) => {
  const progress = (currentChunk / totalChunks) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Processing chunks...</span>
        <span>{currentChunk} of {totalChunks}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      await processCryptoData({
        onChunkProgress: (current, total) => {
          setCurrentChunk(current);
          setTotalChunks(total);
        }
      });
    } catch (error) {
      console.error('Processing error:', error);
      setError('Failed to process data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Crypto Data Processor</h1>
        
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Generate CSV'}
          </button>
          
          {isProcessing && (
            <ProcessingStatus
              currentChunk={currentChunk}
              totalChunks={totalChunks}
            />
          )}
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </div>
      </div>
    </main>
  );
}

// utils/dataProcessor.js
const CHUNK_SIZE = 100;

const processCryptoData = async ({ onChunkProgress }) => {
  // Extract IDs from filenames
  const ids = CRYPTO_FILES
    .map(filename => {
      const match = filename.match(/^(\d+)-/);
      return match ? parseInt(match[1]) : null;
    })
    .filter(id => id !== null)
    .sort((a, b) => a - b);

  // Split into chunks of 100
  const chunks = chunkArray(ids, CHUNK_SIZE);
  const allData = [];

  for (let i = 0; i < chunks.length; i++) {
    onChunkProgress(i + 1, chunks.length);
    const chunk = chunks[i];
    const idString = chunk.join(',');
    
    try {
      const response = await fetch(`/api/crypto?ids=${idString}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const processedChunk = processApiResponse(data);
      allData.push(...processedChunk);

      // Generate CSV after processing all chunks
      if (i === chunks.length - 1) {
        generateCsv(allData);
      }
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
      throw error;
    }
  }
};

const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
};

const processApiResponse = (data) => {
  return Object.values(data.data).map(crypto => ({
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    slug: crypto.slug,
    ...extractPeriodData(crypto.periods.all_time, 'all_time'),
    ...extractPeriodData(crypto.periods['24h'], '24h'),
    ...extractPeriodData(crypto.periods['7d'], '7d'),
    ...extractPeriodData(crypto.periods['30d'], '30d'),
    ...extractPeriodData(crypto.periods['90d'], '90d'),
    ...extractPeriodData(crypto.periods['365d'], '365d'),
  }));
};

const extractPeriodData = (period, prefix) => {
  const usdData = period.quote.USD;
  return {
    [`${prefix}_open`]: usdData.open,
    [`${prefix}_high`]: usdData.high,
    [`${prefix}_low`]: usdData.low,
    [`${prefix}_close`]: usdData.close,
    [`${prefix}_percent_change`]: usdData.percent_change,
    [`${prefix}_price_change`]: usdData.price_change,
    [`${prefix}_open_timestamp`]: period.open_timestamp,
    [`${prefix}_high_timestamp`]: period.high_timestamp,
    [`${prefix}_low_timestamp`]: period.low_timestamp,
    [`${prefix}_close_timestamp`]: period.close_timestamp,
  };
};

const generateCsv = (data) => {
  const headers = [
    'id', 'name', 'symbol', 'slug',
    'all_time_open', 'all_time_high', 'all_time_low', 'all_time_close',
    'all_time_percent_change', 'all_time_price_change',
    'all_time_open_timestamp', 'all_time_high_timestamp',
    'all_time_low_timestamp', 'all_time_close_timestamp'
  ];
  
  // Add headers for other time periods
  ['24h', '7d', '30d', '90d', '365d'].forEach(period => {
    ['open', 'high', 'low', 'close', 'percent_change', 
     'price_change', 'open_timestamp', 'high_timestamp',
     'low_timestamp', 'close_timestamp'].forEach(metric => {
      headers.push(`${period}_${metric}`);
    });
  });

  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'crypto_data.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};*/

'use client';
import { useState } from 'react';

const intervals = [
  "hourly", "daily", "weekly", "monthly", "yearly",
  "1h", "2h", "3h", "4h", "6h", "12h",
  "1d", "2d", "3d", "7d", "14d", "15d",
  "30d", "60d", "90d", "365d"
];

const CHUNK_SIZE = 100;

const processCryptoData = async ({ 
  cryptoIds, 
  timePeriod, 
  interval, 
  timeStart, 
  timeEnd, 
  onChunkProgress 
}) => {
  // Split IDs into chunks of 100
  const chunks = chunkArray(cryptoIds, CHUNK_SIZE);
  const allData = [];

  for (let i = 0; i < chunks.length; i++) {
    onChunkProgress(i + 1, chunks.length);
    const chunk = chunks[i];
    const idString = chunk.join(',');
    
    try {
      // Construct query parameters
      const params = new URLSearchParams({
        ids: idString,
        time_period: timePeriod,
        interval: interval
      });

      if (timeStart) {
        params.append('time_start', new Date(timeStart).toISOString());
      }
      if (timeEnd) {
        params.append('time_end', new Date(timeEnd).toISOString());
      }

      const response = await fetch(`/api/crypto?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const processedChunk = processApiResponse(data);
      allData.push(...processedChunk);

      // Generate CSV after processing all chunks
      console.log({i})
      console.log({length: chunks.length})
      if (i === chunks.length - 1) {
        generateCsv(allData);
      }
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
      throw error;
    }
  }
  console.log({allData})
};

const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
};

const processApiResponse = (data) => {
  if (!data.data) return [];
  
  const cryptoData = Array.isArray(data.data) ? data.data : [data.data];
  
  return Object.values(cryptoData[0]).map(crypto => {
    const baseData = {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
    };

    console.log(crypto)

    const quoteData = crypto.quotes.reduce((acc, quote) => {
      const dateKey = new Date(quote.time_close).toISOString().split('T')[0];
      return {
        ...acc,
        [`${dateKey}_open`]: quote.quote.USD.open,
        [`${dateKey}_high`]: quote.quote.USD.high,
        [`${dateKey}_low`]: quote.quote.USD.low,
        [`${dateKey}_close`]: quote.quote.USD.close,
        [`${dateKey}_volume`]: quote.quote.USD.volume,
        [`${dateKey}_market_cap`]: quote.quote.USD.market_cap,
        [`${dateKey}_time_open`]: quote.time_open,
        [`${dateKey}_time_close`]: quote.time_close,
        [`${dateKey}_time_high`]: quote.time_high,
        [`${dateKey}_time_low`]: quote.time_low,
      };
    }, {});

    return {
      ...baseData,
      ...quoteData
    };
  });
};

const generateCsv = (data) => {
  if (data.length === 0) return;

  // Get all possible headers from all objects
  const headers = Array.from(
    new Set(
      data.reduce((acc, row) => [...acc, ...Object.keys(row)], [])
    )
  ).sort();

  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] ?? '';
        // Handle values that might contain commas or quotes
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crypto_data_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// const generateCsv = (data) => {
//   if (data.length === 0) return;

//   // Get all possible headers from all objects
//   const headers = Array.from(
//     new Set(
//       data.reduce((acc, row) => [...acc, ...Object.keys(row)], [])
//     )
//   ).sort();

//   const csvContent = [
//     headers.join(','),
//     ...data.map(row => 
//       headers.map(header => {
//         const value = row[header] ?? '';
//         // Handle values that might contain commas
//         return typeof value === 'string' && value.includes(',') 
//           ? `"${value}"`
//           : value;
//       }).join(',')
//     )
//   ].join('\n');

//   const blob = new Blob([csvContent], { type: 'text/csv' });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = 'crypto_data.csv';
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   window.URL.revokeObjectURL(url);
// };

const ProcessingStatus = ({ currentChunk, totalChunks }) => {
  const progress = (currentChunk / totalChunks) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Processing chunks...</span>
        <span>{currentChunk} of {totalChunks}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [error, setError] = useState('');
  
  // New state variables for filters
  const [cryptoIds, setCryptoIds] = useState('');
  const [timePeriod, setTimePeriod] = useState('daily');
  const [interval, setInterval] = useState('1d');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const ids = '1,10,10036,1004,10081,10127,10158,10176,10180,1019,10201,10223,10278,10293,10295,10312,10332,10336,10368,1037,10372,10376,1042,10440,10463,10506,10522,10529,10566,10593,10613,10631,10648,10675,10680,10686,10688,10720,10772,10789,10800,10805,10814,1082,10831,10877,10894,10897,109,10949,10954,1106,11066,11079,11093,11107,11109,11150,11178,11190,1120,11212,11213,11220,11223,11234,11247,11254,11318,11323,11329,11340,11341,11345,11371,11387,11394,11397,11413,11419,11420,11438,11458,11498,11500,11503,1156,11562,11586,11614,11646,11750,118,11813,11815,11945,12043,12060,12066,12089,12118,12136,12148,12150,12173,122,12214,12221,12230,12240,12269,12280,1230,12313,12315,12388,12393,12395,12400,12418,12431,12432,12451,12458,12461,12465,12497,12513,12532,12546,12577,12585,1259,12591,12690,12692,12722,1273,12830,12843,12886,12907,12954,12969,12971,12983,1299,12991,13037,13038,13068,1312,13141,13198,13211,13237,13250,13268,13277,13286,13323,1343,1351,13573,13606,13618,13637,13727,13769,13808,13813,13850,13871,13887,13901,13916,13936,13953,13967,14010,14179,14222,14240,14256,14342,14446,14452,14488,1455,14557,14610,14627,14650,14660,14711,14713,14734,14773,14820,14849,14891,14899,14914,14925,14950,15035,1505,15069,15098,15135,15180,15207,15240,15257,15326,15463,15483,15501,1556,15608,15617,15641,15691,15736,1578,15796,15866,15959,15970,16003,16016,16086,16093,16128,16185,16191,16230,16253,16272,16300,16302,16345,16357,16366,1638,16395,16399,16406,16466,16526,16528,16529,16531,1659,1660,16630,16675,1669,16708,16740,16749,16755,16817,1684,1697,16972,170,1703,17057,17059,1712,17160,17183,17192,1720,1721,17220,17228,17261,17298,17306,17311,17313,1732,1736,17456,17464,17543,1759,17591,17619,17672,17706,1772,17737,17742,17786,1779,17799,17804,17806,17837,1784,17856,1786,17879,1789,17914,17917,17926,17960,18005,18031,18035,18048,18115,18132,18172,18178,18210,1826,18280,18302,1831,1834,18352,18353,18397,18434,18435,18443,18444,1856,18597,18624,18627,18679,18736,18741,18775,18813,1888,18934,18966,1903,19035,19046,1908,19097,19148,1918,19220,19236,19238,19266,1930,19312,19315,19316,19333,19413,19525,19526,1954,19568,19585,19590,19595,19621,19623,19641,1966,19665,19667,1967,19670,19699,19714,19736,19764,19786,19787,1983,19865,19871,19873,19979,20017,2002,2009,20094,2011,20117,20136,20138,20143,2019,20232,20245,20279,20301,20315,20335,20367,20391,20392,20396,20401,2043,2047,20485,20513,20540,20547,20569,20570,20572,20573,20642,20686,20704,20718,20729,20752,20757,2076,2087,20894,20897,2090,20969,21007,21060,21071,21123,21259,21266,21320,21349,2135,21353,21355,2136,21361,21371,21375,21428,2143,21576,21639,21672,21740,21756,21763,21769,2178,21828,21829,21835,21866,21952,21968,21988,22009,22010,22059,22117,22121,2213,22133,2215,22276,22289,2230,2231,22339,22342,22359,2242,2243,2245,22460,22463,2247,22470,22488,22492,22540,22550,22568,22602,22615,22633,2273,2276,2277,22831,22866,22897,2291,22926,22929,22944,2297,23006,23015,23063,23095,23115,23146,23149,23151,2316,23174,23192,2320,23244,23246,23249,23266,23267,23284,23311,23319,23326,23334,23348,23377,23421,23452,23453,2348,2349,23508,23513,23515,23524,23638,23657,2371,23740,23764,23765,23773,23799,23806,23812,23830,23873,23893,23909,2391,23917,2392,23921,23936,23940,23977,23996,24006,24062,24083,24125,24130,24133,24138,24143,2415,24185,24191,24228,2424,24261,24302,24329,24369,24382,2443,24433,24439,24442,24450,24492,24532,24538,24554,24580,24620,24642,2468,2469,24698,24733,24789,24816,24834,24876,2490,24908,2492,2497,24997,2503,2505,25059,25144,25184,25194,25195,25261,25284,2530,25333,25396,2540,25426,25446,2545,25479,2553,25604,25645,25664,25685,25714,2572,25724,25727,25796,258,25822,2585,25876,25956,25963,25987,2603,2605,26086,26135,26248,26267,26277,26289,2630,2634,26413,26497,26514,26536,26540,26566,2658,2665,26650,2667,26719,26732,26762,2677,268,26823,26863,26867,26873,26880,26933,26935,2696,26960,26997,27026,27077,2712,27235,27243,27293,27311,27318,27358,27435,27445,27462,27465,27486,27522,2760,27616,27621,2763,27631,2764,27642,2765,27692,27704,2780,27847,27871,27881,27910,27922,27952,28111,28147,28177,28245,2828,28293,28316,28327,28340,28354,28363,28368,28380,28392,28399,28419,28428,28463,28469,28476,28485,28500,28510,28524,28538,28545,28596,28653,28665,28668,28670,28673,28674,28688,28740,28757,28794,28841,28850,28855,28867,28877,28896,28930,28954,28975,28994,29021,29031,29032,29038,29039,29041,29042,2907,29075,29099,29146,29176,29176,29188,29189,29236,29241,29242,29249,293,29305,29353,29355,29358,2937,29390,29391,29396,29410,29433,29443,29461,29464,29533,29547,29551,29584,29585,29611,29622,29629,29660,29668,29674,29677,29698,29748,29767,29772,29777,29778,29812,29821,29832,29843,29846,29876,29934,29941,29968,2997,29982,29983,29996,30018,30035,30037,30069,30074,30090,3012,30151,30168,30209,30223,30233,30256,30257,30262,30272,30297,30303,30315,30329,30353,30363,30373,30431,30432,30448,30452,30466,30467,30500,30545,30574,30576,30584,30608,30615,30623,30635,30680,30720,30723,30727,30728,30738,30749,30751,30776,30860,30877,30885,30887,30915,30917,30941,30949,31077,31087,31109,31160,31177,31203,31212,31218,31242,31243,31246,31249,3126,31285,31291,31293,31352,31401,31410,31424,31453,31456,31484,31488,31556,31566,31583,31593,31615,31625,31646,31676,31677,31682,31688,31704,31731,31737,31750,31773,31799,31808,31819,31884,31894,31917,31961,31981,31988,32004,32076,32110,32126,32133,32141,32146,32149,32158,32163,32195,32274,32282,32293,32306,32309,32314,32330,32332,32348,32373,32388,32417,32547,32558,32573,32582,32589,32621,32632,32662,32686,32730,32730,32754,32763,32772,32781,32786,328,32825,32845,3285,32856,32859,32877,32890,32917,32992,32994,33016,33037,3306,33082,33110,33112,33136,33164,33165,33177,33189,33249,33296,33326,33390,33419,33434,33435,33478,33536,33550,33556,33569,33637,3364,33663,33707,33716,33735,33785,33793,33823,33849,33883,33900,33913,33939,33973,33983,34017,34031,34040,34053,3408,34111,34123,34154,34167,34177,34199,34203,34213,34220,34229,34246,34260,34270,34297,34323,34348,3437,34444,34454,34473,34486,3449,34494,34544,34545,34549,34565,34636,34735,3481,3581,3589,360,3620,3625,3637,3656,3657,3663,3667,3698,3712,3714,3717,3718,372,3730,3741,3750,3754,3759,3783,3799,3816,3831,3853,3870,3873,3875,3893,3902,3911,3930,3931,3933,3936,3945,3948,3957,3978,3987,3992,4003,4006,4038,405,4074,4075,4078,4090,4092,4096,4118,4121,4144,4156,4157,4200,4206,4217,4264,4268,4361,4411,4427,4431,4467,4487,4491,4508,4566,4679,4680,4691,470,4703,4712,4758,4787,4790,4797,4801,4804,4808,4813,4847,4890,4917,4927,4951,4953,4957,4974,5011,5016,5024,5026,5038,5066,5088,5109,512,5159,5160,5161,5175,5181,52,5200,5253,5266,5274,5279,5330,5338,5354,5355,5370,5392,5410,5426,5445,5446,5450,5453,5468,5482,5488,5513,5522,5541,5552,5583,5589,5590,5600,5612,5616,5623,5721,5798,5802,5815,5841,5847,5886,5922,5925,5994,6053,6113,6118,6176,6179,6224,6377,6430,6543,6554,6591,6636,6668,6682,6715,6724,6773,6780,6804,6830,6863,6892,693,6949,707,7096,7102,7129,7199,7206,7217,7278,7301,7305,7334,7349,7355,7460,7461,7475,7579,7623,7628,7661,7665,7677,77,7757,7817,7819,7942,7972,7978,7986,7988,8000,8034,8036,8044,8066,8067,8083,8085,8105,8107,8132,8133,8144,8166,8182,8196,8209,8224,8245,825,8256,8278,8295,8351,8358,8365,8376,8385,8398,8421,8424,8425,8443,8469,8479,8484,8501,8525,8534,8541,8593,8610,8616,8633,8665,8677,8678,8681,8711,8716,8723,8726,8731,8733,8745,8771,8772,8797,8799,8826,8831,8833,8849,8868,8880,8891,8897,8910,8911,8916,8962,8971,8992,9002,9008,9020,9025,9029,9040,9045,9091,9177,9179,9180,9184,9194,9241,9245,9270,9281,9286,93,9300,9348,9377,9404,9438,9451,9452,9486,9492,9523,9530,9537,9546,9547,9550,9586,9595,9632,9637,9643,9700,9720,9749,9760,9764,9767,9816,9827,9828,9855,9863,9869,9906,9936,9943,9958,9967'

  const handleProcess = async () => {
    if (!cryptoIds.trim()) {
      setError('Please enter at least one crypto ID');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      await processCryptoData({
        cryptoIds: cryptoIds.split(',').map(id => id.trim()),
        timePeriod,
        interval,
        timeStart,
        timeEnd,
        onChunkProgress: (current, total) => {
          setCurrentChunk(current);
          setTotalChunks(total);
        }
      });
    } catch (error) {
      console.error('Processing error:', error);
      setError('Failed to process data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Crypto Data Processor</h1>
        
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {/* Crypto IDs Input */}
            <div>
              <label htmlFor="cryptoIds" className="block text-sm font-medium text-gray-700">
                Crypto IDs (comma-separated)
              </label>
              <input
                id="cryptoIds"
                type="text"
                value={cryptoIds}
                onChange={(e) => setCryptoIds(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="1,2,3"
              />
            </div>

            {/* Time Period Selection */}
            <div>
              <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700">
                Time Period
              </label>
              <select
                id="timePeriod"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>

            {/* Interval Selection */}
            <div>
              <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
                Interval
              </label>
              <select
                id="interval"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {intervals.map((int) => (
                  <option key={int} value={int}>{int}</option>
                ))}
              </select>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeStart" className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  id="timeStart"
                  type="datetime-local"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="timeEnd" className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  id="timeEnd"
                  type="datetime-local"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Generate CSV'}
          </button>
          
          {isProcessing && (
            <ProcessingStatus
              currentChunk={currentChunk}
              totalChunks={totalChunks}
            />
          )}
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </div>
      </div>
      <div className='space-y-6 bg-white p-6 rounded-lg shadow max-w-full break-words mt-14'>
          <button
            onClick={async() => {await navigator.clipboard.writeText(ids)}}
            className="px-4 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
          >
            Copy White paper's token's Ids to Clipboard
          </button>
        {ids}
      </div>
    </main>
  );
}