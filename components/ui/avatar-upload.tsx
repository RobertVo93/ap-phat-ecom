'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X, Check, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  trigger?: React.ReactNode;
}

export function AvatarUpload({ currentAvatar, onAvatarChange, trigger }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processImage = useCallback((imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to 200x200 for avatar
        const size = 200;
        canvas.width = size;
        canvas.height = size;

        // Calculate crop dimensions to make it square
        const minDimension = Math.min(img.width, img.height);
        const cropX = (img.width - minDimension) / 2;
        const cropY = (img.height - minDimension) / 2;

        // Draw and crop the image
        ctx.drawImage(
          img,
          cropX, cropY, minDimension, minDimension,
          0, 0, size, size
        );

        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = imageUrl;
    });
  }, []);

  const handleSaveAvatar = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const processedImageUrl = await processImage(selectedImage);
      onAvatarChange(processedImageUrl);
      setIsOpen(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Có lỗi xảy ra khi xử lý hình ảnh');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
    >
      <Camera className="w-4 h-4 mr-2" />
      Thay đổi ảnh đại diện
    </Button>
  );

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#573e1c]">
              Thay đổi ảnh đại diện
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {!selectedImage ? (
              <div className="space-y-4">
                {/* Current Avatar Preview */}
                {currentAvatar && (
                  <div className="text-center">
                    <p className="text-sm text-[#8b6a42] mb-2">Ảnh hiện tại:</p>
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#d4c5a0]">
                      <img
                        src={currentAvatar}
                        alt="Current avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <Card
                  className={`border-2 border-dashed transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-[#573e1c] bg-[#efe1c1]'
                      : 'border-[#8b6a42] hover:border-[#573e1c] hover:bg-[#f8f5f0]'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CardContent className="p-8 text-center">
                    <Upload className="w-12 h-12 text-[#8b6a42] mx-auto mb-4" />
                    <p className="text-[#573e1c] font-medium mb-2">
                      Kéo thả ảnh vào đây hoặc click để chọn
                    </p>
                    <p className="text-sm text-[#8b6a42]">
                      Hỗ trợ JPG, PNG, GIF (tối đa 5MB)
                    </p>
                  </CardContent>
                </Card>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="text-center">
                  <p className="text-sm text-[#8b6a42] mb-4">Xem trước ảnh đại diện:</p>
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#573e1c] mx-auto">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-[#573e1c] text-[#efe1c1] rounded-full p-1">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-[#efe1c1] p-3 rounded-lg">
                  <p className="text-xs text-[#8b6a42] text-center">
                    Ảnh sẽ được cắt thành hình vuông và thay đổi kích thước phù hợp
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 border-[#8b6a42] text-[#8b6a42] hover:bg-[#8b6a42] hover:text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    onClick={() => setSelectedImage(null)}
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Chọn lại
                  </Button>
                  <Button
                    onClick={handleSaveAvatar}
                    disabled={isProcessing}
                    className="flex-1 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                  >
                    {isProcessing ? (
                      <>
                        <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Lưu ảnh
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}