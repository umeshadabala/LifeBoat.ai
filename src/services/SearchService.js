/**
 * SearchService.js
 * Infrastructure for fetching real-time jobs via external APIs.
 */

export const fetchRealtimeJobs = async (query = "", filters = {}) => {
    const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
    const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY;

    if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
        console.warn("ADZUNA API keys missing. Falling back to local verified dataset.");
        return null;
    }

    try {
        const region = filters.region === 'All Locations' ? 'gb' : filters.region.toLowerCase().substring(0, 2);
        const url = `https://api.adzuna.com/v1/api/jobs/${region}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${query || filters.role || 'Software Engineer'}&results_per_page=50&content-type=application/json`;

        const response = await fetch(url);
        const data = await response.json();

        return data.results.map(j => ({
            id: j.id,
            title: j.title,
            company: j.company.display_name,
            location: j.location.display_name,
            match: 85 + Math.floor(Math.random() * 15),
            salary: j.salary_min ? `£${Math.floor(j.salary_min / 1000)}k+` : "Competitive",
            tags: [j.category.label, "Live"],
            url: j.redirect_url, // DIRECT FEED
            source: "ADZUNA_LIVE"
        }));
    } catch (error) {
        console.error("Scraping error:", error);
        return null;
    }
};
