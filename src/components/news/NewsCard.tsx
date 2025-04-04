
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

interface NewsCardProps {
  newsItem: NewsItem;
}

const NewsCard = ({ newsItem }: NewsCardProps) => {
  return (
    <Card className={cn("card-hover h-full flex flex-col")}>
      <CardHeader className="flex flex-col space-y-1.5 pb-2">
        <CardTitle className="text-base font-medium line-clamp-2">{newsItem.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 flex-grow">
        {newsItem.imageUrl && (
          <img 
            src={newsItem.imageUrl} 
            alt={newsItem.title}
            className="rounded-md w-full h-32 object-cover" 
          />
        )}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {newsItem.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <span className="font-medium">{newsItem.source}</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(newsItem.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <a 
          href={newsItem.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Read more
        </a>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
