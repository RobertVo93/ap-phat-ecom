'use client';

import React from 'react';
import { Truck, MapPin, Clock, Thermometer, Droplets, Building, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { ITransportationRecord } from '@/types/batch.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BatchTransportationProps {
  transportationHistory: ITransportationRecord[];
  formatDate: (date: string) => string;
  getTransportationStatusColor: (status: string) => string;
}

export function BatchTransportation({
  transportationHistory,
  formatDate,
  getTransportationStatusColor
}: BatchTransportationProps) {
  const { language, t } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'picked_up':
        return '📦';
      case 'in_transit':
        return '🚛';
      case 'delivered':
        return '✅';
      case 'stored':
        return '🏪';
      default:
        return '📍';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#573e1c] mb-2">
          {t('batch.transportation.title')}
        </h2>
        <p className="text-[#8b6a42]">
          {t('batch.transportation.subtitle')}
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#d4c5a0]"></div>

        <div className="space-y-6">
          {transportationHistory.map((record, index) => (
            <div key={record.id} className="relative flex items-start space-x-6">
              {/* Timeline Node */}
              <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                record.status === 'delivered' ? 'bg-green-500' :
                record.status === 'in_transit' ? 'bg-yellow-500' :
                record.status === 'picked_up' ? 'bg-blue-500' : 'bg-purple-500'
              }`}>
                {getStatusIcon(record.status || '')}
              </div>

              {/* Transportation Content */}
              <div className="flex-1 min-w-0">
                <Card className="bg-white border-[#d4c5a0] hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#573e1c] text-lg flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        {language === 'vi' ? record.location : record.locationEn}
                      </CardTitle>
                      <Badge className={getTransportationStatusColor(record.status || '')}>
                        {t(`batch.transportation.status.${record.status}`)}
                      </Badge>
                    </div>
                    {record.timestamp && (
                      <p className="text-sm text-[#8b6a42] flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(record.timestamp)}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Distributor Information */}
                    {record.distributor && (
                      <Card className="bg-[#f8f5f0] border-[#efe1c1]">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-[#573e1c] rounded-full flex items-center justify-center">
                              <Building className="w-5 h-5 text-[#efe1c1]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#573e1c] mb-1">
                                {language === 'vi' ? record.distributor.name : record.distributor.nameEn}
                              </h4>
                              <p className="text-sm text-[#8b6a42] mb-2">
                                {language === 'vi' ? record.distributor.address : record.distributor.addressEn}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-[#8b6a42]">
                                {record.distributor.phone && (
                                  <div className="flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {record.distributor.phone}
                                  </div>
                                )}
                                {record.distributor.email && (
                                  <div className="flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {record.distributor.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Storage Conditions */}
                    {(record.temperature || record.humidity) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {record.temperature && (
                          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                            <Thermometer className="w-4 h-4 text-blue-600" />
                            <div>
                              <span className="text-xs text-blue-700 font-medium">{t('batch.transportation.temperature')}</span>
                              <p className="font-semibold text-blue-800">{record.temperature}</p>
                            </div>
                          </div>
                        )}
                        
                        {record.humidity && (
                          <div className="flex items-center space-x-2 p-3 bg-cyan-50 rounded-lg">
                            <Droplets className="w-4 h-4 text-cyan-600" />
                            <div>
                              <span className="text-xs text-cyan-700 font-medium">{t('batch.transportation.humidity')}</span>
                              <p className="font-semibold text-cyan-800">{record.humidity}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {record.notes && (
                      <p className="text-sm text-[#8b6a42] italic">
                        {language === 'vi' ? record.notes : record.notesEn}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}