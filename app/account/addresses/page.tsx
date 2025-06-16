'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Address } from '@/lib/types';

export default function AddressesPage() {
  const { t } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: 'TP.HCM',
    isDefault: false
  });

  if (!user) {
    return null;
  }

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      name: user.name,
      phone: user.phone,
      street: '',
      ward: '',
      district: '',
      city: 'TP.HCM',
      isDefault: false
    });
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      street: address.street,
      ward: address.ward,
      district: address.district,
      city: address.city,
      isDefault: address.isDefault
    });
    setIsDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    const newAddress: Address = {
      id: editingAddress?.id || Date.now().toString(),
      ...formData
    };

    let updatedAddresses = [...user.addresses];

    if (editingAddress) {
      // Update existing address
      updatedAddresses = updatedAddresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      // Add new address
      updatedAddresses.push(newAddress);
    }

    // If this is set as default, remove default from others
    if (formData.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    await updateProfile({ addresses: updatedAddresses });
    setIsDialogOpen(false);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      await updateProfile({ addresses: updatedAddresses });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    const updatedAddresses = user.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    await updateProfile({ addresses: updatedAddresses });
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              asChild
              variant="ghost"
              className="text-[#573e1c] hover:bg-[#efe1c1]"
            >
              <Link href="/account">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại tài khoản
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
                Quản lý địa chỉ
              </h1>
              <p className="text-[#8b6a42] mt-2">
                Thêm và quản lý địa chỉ giao hàng của bạn
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleAddAddress}
                  className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm địa chỉ mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#573e1c]">
                    {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#573e1c]">Họ và tên *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#573e1c]">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-[#573e1c]">Địa chỉ *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData({...formData, street: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ward" className="text-[#573e1c]">Phường/Xã *</Label>
                      <Input
                        id="ward"
                        value={formData.ward}
                        onChange={(e) => setFormData({...formData, ward: e.target.value})}
                        className="border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-[#573e1c]">Quận/Huyện *</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                        className="border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[#573e1c]">Tỉnh/Thành phố *</Label>
                      <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                        <SelectTrigger className="border-[#8b6a42]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TP.HCM">TP. Hồ Chí Minh</SelectItem>
                          <SelectItem value="Hanoi">Hà Nội</SelectItem>
                          <SelectItem value="Danang">Đà Nẵng</SelectItem>
                          <SelectItem value="Cantho">Cần Thơ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) => setFormData({...formData, isDefault: !!checked})}
                    />
                    <Label htmlFor="isDefault" className="text-[#8b6a42]">
                      Đặt làm địa chỉ mặc định
                    </Label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSaveAddress}
                      className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                    >
                      {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Addresses List */}
        <div className="space-y-4">
          {user.addresses.length === 0 ? (
            <Card className="bg-white border-[#d4c5a0]">
              <CardContent className="p-12 text-center">
                <MapPin className="w-16 h-16 text-[#8b6a42] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#573e1c] mb-2">
                  Chưa có địa chỉ nào
                </h3>
                <p className="text-[#8b6a42] mb-6">
                  Thêm địa chỉ giao hàng để đặt hàng dễ dàng hơn
                </p>
                <Button
                  onClick={handleAddAddress}
                  className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm địa chỉ đầu tiên
                </Button>
              </CardContent>
            </Card>
          ) : (
            user.addresses.map((address) => (
              <Card key={address.id} className="bg-white border-[#d4c5a0]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-[#573e1c]">{address.name}</h3>
                        {address.isDefault && (
                          <Badge className="bg-[#573e1c] text-[#efe1c1]">
                            <Star className="w-3 h-3 mr-1" />
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      <p className="text-[#8b6a42] mb-1">{address.phone}</p>
                      <p className="text-[#8b6a42]">
                        {address.street}, {address.ward}, {address.district}, {address.city}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="text-[#573e1c] hover:bg-[#efe1c1]"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Đặt mặc định
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAddress(address)}
                        className="text-[#573e1c] hover:bg-[#efe1c1]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}