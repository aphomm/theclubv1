'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, MoreVertical } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  event_type: string;
  date: string;
  location: string;
  capacity: number;
  created_at: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) return;

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      setEvents(data || []);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-light mb-2">Events</h1>
          <p className="text-stone-400 font-light">Manage club events and masterclasses</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-600 text-stone-950 px-6 py-3 text-sm font-light hover:bg-amber-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Event
        </button>
      </div>

      {/* Events Table */}
      <div className="border border-stone-800">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-12 w-12 bg-stone-900 rounded-full animate-pulse" />
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-stone-400 font-light">
            No events found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-800">
                  <th className="px-6 py-4 text-left text-xs font-light text-stone-400 uppercase tracking-wide">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-stone-400 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-stone-400 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-stone-400 uppercase tracking-wide">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-stone-400 uppercase tracking-wide">
                    Capacity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-stone-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, idx) => (
                  <tr key={event.id} className={idx !== events.length - 1 ? 'border-b border-stone-800' : ''}>
                    <td className="px-6 py-4 font-light max-w-sm truncate">{event.title}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-amber-600/20 text-amber-600 px-3 py-1 font-light uppercase">
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-400 font-light">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-400 font-light">{event.location}</td>
                    <td className="px-6 py-4 font-light">{event.capacity}</td>
                    <td className="px-6 py-4">
                      <button className="text-stone-400 hover:text-amber-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
