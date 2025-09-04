"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "~/components/ui/select";
// import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
// import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon, X, Plus } from "lucide-react";
// import { format } from "date-fns";
import { createBookSchema, type BookFormData } from "~/zod-schemas/book";
import { useForm } from "react-hook-form";
// Zod Schema

const BookCreationForm = () => {
  const [keywordInput, setKeywordInput] = React.useState("");
  const [tagInput, setTagInput] = React.useState("");
  const [galleryInput, setGalleryInput] = React.useState("");
  const form = useForm<BookFormData>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      isbn: "",
      isbn13: "",
      basePrice: 100,
      publisher: "",
      publishedDate: new Date(),
      currency: "USD",
      language: "en",
      pageCount: 0,
      wordCount: 0,
      readingTime: 0,
      isExclusive: false,
      ageRating: "G",
      metaTitle: "",
      metaDescription: "",
      contentWarnings: [],
      keywords: [],
      tags: [],
      authorId: "",
      categoryId: "",
      seriesId: "",
      seriesOrder: 1,
    },
  });
  const onSubmit = (data: BookFormData) => {
    console.log("Form submitted:", data); // Handle form submission here
  };
  //   const addKeyword = () => {
  //     if (keywordInput.trim()) {
  //       const currentKeywords = form.getValues("keywords");
  //       if (!currentKeywords.includes(keywordInput.trim())) {
  //         form.setValue("keywords", [...currentKeywords, keywordInput.trim()]);
  //       }
  //       setKeywordInput("");
  //     }
  //   };
  //   const removeKeyword = (keyword: string) => {
  //     const currentKeywords = form.getValues("keywords");
  //     form.setValue(
  //       "keywords",
  //       currentKeywords.filter((k) => k !== keyword),
  //     );
  //   };
  //   const addTag = () => {
  //     if (tagInput.trim()) {
  //       const currentTags = form.getValues("tags");
  //       if (!currentTags.includes(tagInput.trim())) {
  //         form.setValue("tags", [...currentTags, tagInput.trim()]);
  //       }
  //       setTagInput("");
  //     }
  //   };
  //   const removeTag = (tag: string) => {
  //     const currentTags = form.getValues("tags");
  //     form.setValue(
  //       "tags",
  //       currentTags.filter((t) => t !== tag),
  //     );
  //   };
  //   const addGalleryImage = () => {
  //     if (galleryInput.trim()) {
  //       try {
  //         new URL(galleryInput.trim());
  //         const currentImages = form.getValues("galleryImages");
  //         if (!currentImages.includes(galleryInput.trim())) {
  //           form.setValue("galleryImages", [
  //             ...currentImages,
  //             galleryInput.trim(),
  //           ]);
  //         }
  //         setGalleryInput("");
  //       } catch {
  //         // Invalid URL, don't add
  //       }
  //     }
  //   };
  //   const removeGalleryImage = (url: string) => {
  //     const currentImages = form.getValues("galleryImages");
  //     form.setValue(
  //       "galleryImages",
  //       currentImages.filter((img) => img !== url),
  //     );
  //   };
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Book</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details to add a new book to your catalog
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about the book
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter book title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter subtitle (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                     <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter book description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                         
                        <Input placeholder="ISBN-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isbn13"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN-13</FormLabel>
                      <FormControl>
                        <Input placeholder="ISBN-13" {...field} />
                                   
                      </FormControl>
                      <FormMessage />
                        
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
                    {/* Pricing & Sales */}
                    
          {/* <Card>
                        
            <CardHeader>
                            <CardTitle>Pricing & Sales</CardTitle>
                            
              <CardDescription>
                Set pricing and sales information
              </CardDescription>
                          
            </CardHeader>
                        
            <CardContent className="space-y-4">
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Price *</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                                            
                      <FormLabel>Original Price</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                                              
                      </FormControl>
                                            
                      <FormDescription>For showing discounts</FormDescription>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Currency</FormLabel>
                                            
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                                                
                        <FormControl>
                                                    
                          <SelectTrigger>
                                                        
                            <SelectValue placeholder="Select currency" />
                                                      
                          </SelectTrigger>
                                                  
                        </FormControl>
                                                
                        <SelectContent>
                                                    
                          <SelectItem value="USD">USD</SelectItem>
                                                    
                          <SelectItem value="EUR">EUR</SelectItem>
                                                    
                          <SelectItem value="GBP">GBP</SelectItem>
                                                    
                          <SelectItem value="PHP">PHP</SelectItem>
                                                  
                        </SelectContent>
                                              
                      </Select>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <div className="flex items-center space-x-4">
                                
                <FormField
                  control={form.control}
                  name="isOnSale"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                                            
                      <FormControl>
                                                
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                                              
                      </FormControl>
                                            <FormLabel>On Sale</FormLabel>
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              {form.watch("isOnSale") && (
                <FormField
                  control={form.control}
                  name="saleEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                                            <FormLabel>Sale End Date</FormLabel>
                                            
                      <Popover>
                                                
                        <PopoverTrigger asChild>
                                                    
                          <FormControl>
                                                        
                            <Button
                              variant="outline"
                              className="w-[240px] pl-3 text-left font-normal"
                            >
                                                            
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                                                            
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                          
                            </Button>
                                                      
                          </FormControl>
                                                  
                        </PopoverTrigger>
                                                
                        <PopoverContent className="w-auto p-0" align="start">
                                                    
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                                                  
                        </PopoverContent>
                                              
                      </Popover>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
              )}
                          
            </CardContent>
                      
          </Card> */}
                    {/* Book Details */}
                    
          {/* <Card>
                        
            <CardHeader>
                            <CardTitle>Book Details</CardTitle>
                            
              <CardDescription>
                Additional information about the book
              </CardDescription>
                          
            </CardHeader>
                        
            <CardContent className="space-y-4">
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Publisher</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input placeholder="Publisher name" {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Language</FormLabel>
                                            
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                                                
                        <FormControl>
                                                    
                          <SelectTrigger>
                                                        
                            <SelectValue placeholder="Select language" />
                                                      
                          </SelectTrigger>
                                                  
                        </FormControl>
                                                
                        <SelectContent>
                                                    
                          <SelectItem value="en">English</SelectItem>
                                                    
                          <SelectItem value="es">Spanish</SelectItem>
                                                    
                          <SelectItem value="fr">French</SelectItem>
                                                    
                          <SelectItem value="de">German</SelectItem>
                                                    
                          <SelectItem value="it">Italian</SelectItem>
                                                    
                          <SelectItem value="pt">Portuguese</SelectItem>
                                                  
                        </SelectContent>
                                              
                      </Select>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <FormField
                control={form.control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                                        <FormLabel>Published Date</FormLabel>
                                        
                    <Popover>
                                            
                      <PopoverTrigger asChild>
                                                
                        <FormControl>
                                                    
                          <Button
                            variant="outline"
                            className="w-[240px] pl-3 text-left font-normal"
                          >
                                                        
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                                                        
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                      
                          </Button>
                                                  
                        </FormControl>
                                              
                      </PopoverTrigger>
                                            
                      <PopoverContent className="w-auto p-0" align="start">
                                                
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                                              
                      </PopoverContent>
                                          
                    </Popover>
                                        
                    <FormMessage />
                                      
                  </FormItem>
                )}
              />
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                
                <FormField
                  control={form.control}
                  name="pageCount"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Page Count</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input type="number" placeholder="0" {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="wordCount"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Word Count</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input type="number" placeholder="0" {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="readingTime"
                  render={({ field }) => (
                    <FormItem>
                                            
                      <FormLabel>Reading Time (minutes)</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input type="number" placeholder="0" {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                
                <FormField
                  control={form.control}
                  name="ageRating"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Age Rating</FormLabel>
                                            
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                                                
                        <FormControl>
                                                    
                          <SelectTrigger>
                                                        
                            <SelectValue placeholder="Select age rating" />
                                                      
                          </SelectTrigger>
                                                  
                        </FormControl>
                                                
                        <SelectContent>
                                                    
                          <SelectItem value="G">
                            G - General Audiences
                          </SelectItem>
                                                    
                          <SelectItem value="PG">
                            PG - Parental Guidance
                          </SelectItem>
                                                    
                          <SelectItem value="PG-13">
                            PG-13 - Parents Strongly Cautioned
                          </SelectItem>
                                                    
                          <SelectItem value="R">R - Restricted</SelectItem>
                                                    
                          <SelectItem value="Adult">
                            Adult - Adults Only
                          </SelectItem>
                                                  
                        </SelectContent>
                                              
                      </Select>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <FormField
                control={form.control}
                name="contentWarnings"
                render={({ field }) => (
                  <FormItem>
                                        <FormLabel>Content Warnings</FormLabel>
                                        
                    <FormControl>
                                            
                      <Input
                        placeholder="Violence, Language, etc. (comma-separated)"
                        {...field}
                      />
                                          
                    </FormControl>
                                        
                    <FormDescription>
                      Comma-separated list of content warnings
                    </FormDescription>
                                        
                    <FormMessage />
                                      
                  </FormItem>
                )}
              />
                          
            </CardContent>
                      
          </Card> */}
                    {/* File Information */}
                    
          {/* <Card>
                        
            <CardHeader>
                            <CardTitle>File Information</CardTitle>
                            
              <CardDescription>Digital file details</CardDescription>
                          
            </CardHeader>
                        
            <CardContent className="space-y-4">
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                
                <FormField
                  control={form.control}
                  name="fileSize"
                  render={({ field }) => (
                    <FormItem>
                                            
                      <FormLabel>File Size (bytes)</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input type="number" placeholder="0" {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <FormField
                control={form.control}
                name="fileFormat"
                render={() => (
                  <FormItem>
                                        <FormLabel>File Formats</FormLabel>
                                        
                    <div className="flex flex-wrap gap-4">
                                            
                      {["PDF", "EPUB", "MOBI", "AZW3"].map((format) => (
                        <FormField
                          key={format}
                          control={form.control}
                          name="fileFormat"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={format}
                                className="flex flex-row items-start space-y-0 space-x-3"
                              >
                                                                
                                <FormControl>
                                                                    
                                  <Checkbox
                                    checked={field.value?.includes(format)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            format,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== format,
                                            ),
                                          );
                                    }}
                                  />
                                                                  
                                </FormControl>
                                                                
                                <FormLabel className="font-normal">
                                                                    {format}
                                                                  
                                </FormLabel>
                                                              
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                                          
                    </div>
                                        
                    <FormMessage />
                                      
                  </FormItem>
                )}
              />
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                
                <FormField
                  control={form.control}
                  name="downloadUrl"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Download URL</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input placeholder="https://..." {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="previewUrl"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Preview URL</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input placeholder="https://..." {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                          
            </CardContent>
                      
          </Card> */}
                    {/* Media */}
                    
          {/* <Card>
                        
            <CardHeader>
                            <CardTitle>Media</CardTitle>
                            
              <CardDescription>Cover image and gallery</CardDescription>
                          
            </CardHeader>
                        
            <CardContent className="space-y-4">
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                
                <FormField
                  control={form.control}
                  name="coverImageUrl"
                  render={({ field }) => (
                    <FormItem>
                                            
                      <FormLabel>Cover Image URL</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input placeholder="https://..." {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="coverImageAlt"
                  render={({ field }) => (
                    <FormItem>
                                            
                      <FormLabel>Cover Image Alt Text</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input
                          placeholder="Describe the cover image"
                          {...field}
                        />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <FormField
                control={form.control}
                name="galleryImages"
                render={() => (
                  <FormItem>
                                        <FormLabel>Gallery Images</FormLabel>
                                        
                    <div className="flex space-x-2">
                                            
                      <Input
                        placeholder="Add image URL"
                        value={galleryInput}
                        onChange={(e) => setGalleryInput(e.target.value)}
                      />
                                            
                      <Button type="button" onClick={addGalleryImage}>
                                                
                        <Plus className="h-4 w-4" />
                                              
                      </Button>
                                          
                    </div>
                                        
                    <div className="mt-2 flex flex-wrap gap-2">
                                            
                      {form.watch("galleryImages").map((url, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                                                    
                          <span className="max-w-[100px] truncate">{url}</span>
                                                    
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeGalleryImage(url)}
                          />
                                                  
                        </Badge>
                      ))}
                                          
                    </div>
                                        
                    <FormMessage />
                                      
                  </FormItem>
                )}
              />
                          
            </CardContent>
                      
          </Card> */}
                    {/* Status & Relations */}
                    
          {/* <Card>
                        
            <CardHeader>
                            <CardTitle>Status & Relations</CardTitle>
                            
              <CardDescription>Book status and relationships</CardDescription>
                          
            </CardHeader>
                        
            <CardContent className="space-y-4">
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                                                
                        <FormControl>
                                                    
                          <SelectTrigger>
                                                        
                            <SelectValue placeholder="Select status" />
                                                      
                          </SelectTrigger>
                                                  
                        </FormControl>
                                                
                        <SelectContent>
                                                    
                          <SelectItem value="DRAFT">Draft</SelectItem>
                                                    
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                                                    
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                  
                        </SelectContent>
                                              
                      </Select>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Author *</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input placeholder="Author ID" {...field} />
                                              
                      </FormControl>
                                            
                      <FormDescription>
                        Select from existing authors
                      </FormDescription>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Category *</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input placeholder="Category ID" {...field} />
                                              
                      </FormControl>
                                            
                      <FormDescription>
                        Select from existing categories
                      </FormDescription>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="seriesId"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Series</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input placeholder="Series ID (optional)" {...field} />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              {form.watch("seriesId") && (
                <FormField
                  control={form.control}
                  name="seriesOrder"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Series Order</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input
                          type="number"
                          placeholder="Book number in series"
                          {...field}
                        />
                                              
                      </FormControl>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
              )}
                            
              <div className="flex flex-wrap gap-4">
                                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                                            
                      <FormControl>
                                                
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                                              
                      </FormControl>
                                            <FormLabel>Active</FormLabel>
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                                            
                      <FormControl>
                                                
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                                              
                      </FormControl>
                                            <FormLabel>Featured</FormLabel>
                                          
                    </FormItem>
                  )}
                />
                                
                <FormField
                  control={form.control}
                  name="isExclusive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                                            
                      <FormControl>
                                                
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                                              
                      </FormControl>
                                            <FormLabel>Exclusive</FormLabel>
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                                        <FormLabel>Available From</FormLabel>
                                        
                    <Popover>
                                            
                      <PopoverTrigger asChild>
                                                
                        <FormControl>
                                                    
                          <Button
                            variant="outline"
                            className="w-[240px] pl-3 text-left font-normal"
                          >
                                                        
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                                                        
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                      
                          </Button>
                                                  
                        </FormControl>
                                              
                      </PopoverTrigger>
                                            
                      <PopoverContent className="w-auto p-0" align="start">
                                                
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                                              
                      </PopoverContent>
                                          
                    </Popover>
                                        
                    <FormDescription>For pre-order support</FormDescription>
                                        
                    <FormMessage />
                                      
                  </FormItem>
                )}
              />
                          
            </CardContent>
                      
          </Card> */}
          {/* SEO & Marketing */}
          {/* <Card>
                        
            <CardHeader>
                            <CardTitle>SEO & Marketing</CardTitle>
                            
              <CardDescription>
                Search engine optimization and marketing tags
              </CardDescription>
                          
            </CardHeader>
                        
            <CardContent className="space-y-4">
                            
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                                            <FormLabel>Meta Title</FormLabel>
                                            
                      <FormControl>
                                                
                        <Input
                          placeholder="SEO title (max 60 chars)"
                          {...field}
                        />
                                              
                      </FormControl>
                                            
                      <FormDescription>
                                                {field.value?.length || 0}/60
                        characters                       
                      </FormDescription>
                                            
                      <FormMessage />
                                          
                    </FormItem>
                  )}
                />
                              
              </div>
                            
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                                        <FormLabel>Meta Description</FormLabel>
                                        
                    <FormControl>
                                            
                      <Textarea
                        placeholder="SEO description (max 160 chars)"
                        className="min-h-[60px]"
                        {...field}
                      />
                                          
                    </FormControl>
                                        
                    <FormDescription>
                                            {field.value?.length || 0}/160
                      characters                     
                    </FormDescription>
                                        
                    <FormMessage />
                                      
                  </FormItem>
                )}
              />
                            
              <FormField
                control={form.control}
                name="keywords"
                render={() => (
                  <FormItem>
                                        <FormLabel>Keywords</FormLabel>
                                        
                    <div className="flex space-x-2">
                                            
                      <Input
                        placeholder="Add keyword"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addKeyword())
                        }
                      />
                                            
                      <Button type="button" onClick={addKeyword}>
                                                
                        <Plus className="h-4 w-4" />
                                              
                      </Button>
                                          
                    </div>
                                        
                    <div className="mt-2 flex flex-wrap gap-2">
                                            
                      {form.watch("keywords").map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                                                    {keyword}
                                                    
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeKeyword(keyword)}
                          />
                                                  
                        </Badge>
                      ))}
                                          
                    </div>
                                        
                    <FormDescription>
                      Searchable keywords for the book
                    </FormDescription>
                                        
                    <FormMessage />
                                      
                  </FormItem>
                )}
              />
                            
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        
                    <div className="flex space-x-2">
                                            
                      <Input
                        placeholder="Add tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                                            
                      <Button type="button" onClick={addTag}>
                                                
                        <Plus className="h-4 w-4" />
                                              
                      </Button>
                                          
                    </div>
                                        
                    <div className="mt-2 flex flex-wrap gap-2">
                                            
                      {form.watch("tags").map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                                                    {tag}
                                                    
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                                                  
                        </Badge>
                      ))}
                                          
                    </div>
                                        
                    <FormDescription>Genre tags and themes</FormDescription>
                                        
                    <FormMessage />
                                      
                  </FormItem>
                )}
              />
                          
            </CardContent>
                      
          </Card> */}
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit">Create Book</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default BookCreationForm;
