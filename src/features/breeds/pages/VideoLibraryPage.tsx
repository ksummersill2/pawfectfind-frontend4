import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Search, Filter, ChevronDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import VideoPlayer from '../components/VideoPlayer';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  breed_id: string;
  category: string;
  author: {
    display_name: string;
    avatar_url: string;
  };
  created_at: string;
}

const VideoLibraryPage: React.FC = () => {
  const { breed } = useParams<{ breed: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'training', name: 'Training' },
    { id: 'grooming', name: 'Grooming' },
    { id: 'health', name: 'Health' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'behavior', name: 'Behavior' }
  ];

  useEffect(() => {
    fetchVideos();
  }, [breed, selectedCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data: breedData, error: breedError } = await supabase
        .from('dog_breeds')
        .select('id')
        .eq('name', breed)
        .single();

      if (breedError) throw breedError;

      let query = supabase
        .from('breed_videos')
        .select(`
          *,
          author:author_id(
            display_name,
            avatar_url
          )
        `)
        .eq('breed_id', breedData.id)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data: videos, error: videosError } = await query;

      if (videosError) throw videosError;
      setVideos(videos || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO 
        title={`${breed} Training Videos & Guides`}
        description={`Watch helpful videos about training, grooming, and caring for your ${breed}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link
            to={`/breed/${breed}`}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {breed} Overview
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {breed} Video Library
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No videos found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="group relative">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="p-3 bg-white/90 rounded-full transform scale-90 group-hover:scale-100 transition-transform"
                    >
                      <Play className="w-6 h-6 text-blue-600" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 rounded-full capitalize">
                      {video.category}
                    </span>
                    {video.author && (
                      <div className="flex items-center text-sm text-gray-500">
                        {video.author.avatar_url && (
                          <img
                            src={video.author.avatar_url}
                            alt={video.author.display_name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        )}
                        <span>{video.author.display_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo}
      />
    </>
  );
};

export default VideoLibraryPage;