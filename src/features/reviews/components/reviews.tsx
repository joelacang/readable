"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Progress } from "~/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  spoilerWarning?: boolean;
}

const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Sarah M.",
    userAvatar: "/placeholder.svg?height=40&width=40&text=SM",
    rating: 5,
    title: "Absolutely captivating fantasy adventure!",
    content:
      "Elena Rodriguez has crafted an incredible world with the Ethereal Realm. Lyra's journey from a confused young mage to someone who must save her world is beautifully written. The magic system is unique and well-thought-out, and the character development is outstanding. I couldn't put this book down and immediately ordered the next book in the series!",
    date: "2024-01-15",
    verified: true,
    helpful: 23,
    notHelpful: 2,
  },
  {
    id: "2",
    userName: "BookLover2023",
    rating: 4,
    title: "Great start to a promising series",
    content:
      "This book has everything I love in fantasy - magic, adventure, and a strong female protagonist. The world-building is impressive and the plot moves at a good pace. My only complaint is that some of the secondary characters could have been developed more. Still, highly recommend for fantasy fans!",
    date: "2024-01-10",
    verified: false,
    helpful: 18,
    notHelpful: 1,
  },
  {
    id: "3",
    userName: "Alex Chen",
    userAvatar: "/placeholder.svg?height=40&width=40&text=AC",
    rating: 5,
    title: "Perfect blend of action and emotion",
    content:
      "What struck me most about this book was how well Rodriguez balanced the action sequences with emotional depth. Lyra's internal struggles feel real and relatable, even in this fantastical setting. The ethereal realm concept is fascinating and I love how the magic system has clear rules and consequences.",
    date: "2024-01-08",
    verified: true,
    helpful: 15,
    notHelpful: 0,
    spoilerWarning: true,
  },
  {
    id: "4",
    userName: "FantasyFan88",
    rating: 3,
    title: "Good but not great",
    content:
      "While the premise is interesting and the writing is solid, I found some parts of the story predictable. The romance subplot felt a bit rushed, and I wished there was more exploration of the ethereal realm itself. It's a decent read, but didn't quite live up to the hype for me.",
    date: "2024-01-05",
    verified: false,
    helpful: 8,
    notHelpful: 12,
  },
  {
    id: "5",
    userName: "MagicReader",
    userAvatar: "/placeholder.svg?height=40&width=40&text=MR",
    rating: 4,
    title: "Excellent world-building and magic system",
    content:
      "As someone who reads a lot of fantasy, I was impressed by the originality of the ethereal realm concept. The magic system is well-defined and the consequences of using forbidden magic add real stakes to the story. Looking forward to seeing how the series develops!",
    date: "2024-01-02",
    verified: true,
    helpful: 12,
    notHelpful: 1,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 847, percentage: 68 },
  { stars: 4, count: 312, percentage: 25 },
  { stars: 3, count: 67, percentage: 5 },
  { stars: 2, count: 18, percentage: 1 },
  { stars: 1, count: 12, percentage: 1 },
];

export function Reviews() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
  });
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set(),
  );

  const totalReviews = ratingBreakdown.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const averageRating = 4.6;

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission logic here
    console.log("Submitting review:", newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 0, title: "", content: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reviews & Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating}</div>
              <div className="mt-1 flex items-center justify-center gap-1">
                {renderStars(Math.round(averageRating), "lg")}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                Based on {totalReviews.toLocaleString()} reviews
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 text-sm">
                <span className="w-8">{item.stars}★</span>
                <Progress value={item.percentage} className="h-2 flex-1" />
                <span className="text-muted-foreground w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? "Cancel Review" : "Write a Review"}
          </Button>
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-reviews" className="text-sm">
              Sort by:
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label htmlFor="rating">Rating *</Label>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setNewReview({ ...newReview, rating: i + 1 })
                        }
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            i < newReview.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review-title">Review Title *</Label>
                  <Input
                    id="review-title"
                    value={newReview.title}
                    onChange={(e) =>
                      setNewReview({ ...newReview, title: e.target.value })
                    }
                    placeholder="Summarize your review in a few words"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="review-content">Your Review *</Label>
                  <Textarea
                    id="review-content"
                    value={newReview.content}
                    onChange={(e) =>
                      setNewReview({ ...newReview, content: e.target.value })
                    }
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={
                      !newReview.rating ||
                      !newReview.title ||
                      !newReview.content
                    }
                  >
                    Submit Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {mockReviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id);
            const shouldTruncate = review.content.length > 300;

            return (
              <Card key={review.id} className="border-l-primary/20 border-l-4">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={review.userAvatar ?? "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {review.userName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {review.userName}
                            </span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            {renderStars(review.rating, "sm")}
                            <span className="text-muted-foreground text-xs">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Review Content */}
                    <div>
                      <h4 className="mb-2 font-semibold">{review.title}</h4>
                      {review.spoilerWarning && (
                        <Badge variant="destructive" className="mb-2">
                          Contains Spoilers
                        </Badge>
                      )}
                      <p className="text-muted-foreground leading-relaxed">
                        {shouldTruncate && !isExpanded
                          ? `${review.content.slice(0, 300)}...`
                          : review.content}
                      </p>
                      {shouldTruncate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReviewExpansion(review.id)}
                          className="mt-2 h-auto p-0"
                        >
                          {isExpanded ? (
                            <>
                              Show Less <ChevronUp className="ml-1 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Read More <ChevronDown className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Review Actions */}
                    <div className="flex items-center gap-4 border-t pt-2">
                      <span className="text-muted-foreground text-sm">
                        Was this helpful?
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {review.helpful}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <ThumbsDown className="mr-1 h-3 w-3" />
                          {review.notHelpful}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </CardContent>
    </Card>
  );
}
