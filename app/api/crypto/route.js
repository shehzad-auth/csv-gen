/*export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (!ids) {
        return new Response(JSON.stringify({ error: 'No IDs provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const response = await fetch(
            `https://pro-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest?time_period=all_time,24h,7d,30d,90d,365d&id=${ids}`,
            {method:"GET",headers:{"X-CMC_PRO_API_KEY":"6377a87f-a8ee-4c6f-a62b-f63faefc3e20"}}
        );
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}*/

// app/api/crypto/route.js
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    const timePeriod = searchParams.get('time_period') || 'daily';
    const interval = searchParams.get('interval') || '1d';
    const timeStart = searchParams.get('time_start');
    const timeEnd = searchParams.get('time_end');
  
    if (!ids) {
      return new Response(JSON.stringify({ error: 'No IDs provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    try {
      // Construct the URL with all parameters
      const apiUrl = new URL('https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical');
      apiUrl.searchParams.set('id', ids);
      apiUrl.searchParams.set('time_period', timePeriod);
      apiUrl.searchParams.set('interval', interval);
      
      if (timeStart) {
        apiUrl.searchParams.set('time_start', new Date(timeStart).toISOString());
      }
      if (timeEnd) {
        apiUrl.searchParams.set('time_end', new Date(timeEnd).toISOString());
      }
  
      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": "6377a87f-a8ee-4c6f-a62b-f63faefc3e20"
        }
      });
  
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }