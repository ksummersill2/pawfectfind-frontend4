import React, { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import VideoPlayer from './VideoPlayer';

interface VideoSectionProps {
  breedId: string;
  breedName: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  category: string;
  youtube_url: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ breedId, breedName }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [breedId]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('breed_videos')
        .select('*')
        .eq('breed_id', breedId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (fetchError) throw fetchError;
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo({
      ...video,
      url: video.youtube_url || video.url // Prioritize youtube_url if available
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400">
          No videos available yet for {breedName}
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Play className="w-6 h-6 mr-2" />
          Featured Videos
        </h2>
        <Link
          to={`/breed/${encodeURIComponent(breedName)}/videos`}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center"
        >
          View All
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="group relative">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleVideoClick(video)}
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
              <span className="mt-2 inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 rounded-full capitalize">
                {video.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo}
      />
    </section>
  );
};

export default VideoSection;