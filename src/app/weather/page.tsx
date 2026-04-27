"use client";

import { useState } from "react";
import Image from "next/image";

interface WeatherData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}
export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("");

  const fetchWeather = async (searchLocation: string) => {
    if (!searchLocation.trim()) {
      setError("Please enter a city or country");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error("Weather API key not found");
      }

      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(searchLocation)}&aqi=no`,
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch weather data. Please check the location name.",
        );
      }

      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(location);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Weather App</h1>
          <p className="text-gray-600">
            Enter a city or country to get current weather
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city or country (e.g., London, New York, Paris)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {weather && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {weather.location.name}, {weather.location.country}
            </h2>
            <div className="flex items-center justify-center mb-4">
              <Image
                src={`https:${weather.current.condition.icon}`}
                alt={weather.current.condition.text}
                width={64}
                height={64}
                className="w-16 h-16"
              />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {weather.current.temp_c}°C
            </div>
            <div className="text-lg text-gray-600">
              {weather.current.condition.text}
            </div>
            i want to travel the world with my baby even if its{" "}
            {weather.location.name} ❤️
          </div>
        )}
      </div>
    </div>
  );
}
