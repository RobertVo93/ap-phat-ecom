'use client';

import React from 'react';
import { Clock, Thermometer, Settings, CheckCircle, XCircle, User } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { IProductionStep } from '@/types/batch.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BatchProductionProps {
  productionSteps: IProductionStep[];
  formatDate: (date: string) => string;
  getProductionStepIcon: (status: string) => string;
}

export function BatchProduction({
  productionSteps,
  formatDate,
  getProductionStepIcon
}: BatchProductionProps) {
  const { language, t } = useLanguage();

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#573e1c] mb-2">
          {t('batch.production.title')}
        </h2>
        <p className="text-[#8b6a42]">
          {t('batch.production.subtitle')}
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#d4c5a0]"></div>

        <div className="space-y-8">
          {productionSteps.map((step, index) => (
            <div key={step.id} className="relative flex items-start space-x-6">
              {/* Timeline Node */}
              <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                step.status === 'completed' ? 'bg-green-500' :
                step.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}>
                {step.step}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <Card className="bg-white border-[#d4c5a0] hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#573e1c] text-lg">
                        {t('batch.production.step')} {step.step}: {language === 'vi' ? step.title : step.titleEn}
                      </CardTitle>
                      <Badge className={getStepStatusColor(step.status || '')}>
                        {getProductionStepIcon(step.status || '')} {step.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[#8b6a42] leading-relaxed">
                      {language === 'vi' ? step.description : step.descriptionEn}
                    </p>

                    {/* Step Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-[#8b6a42]" />
                        <div>
                          <span className="text-xs text-[#8b6a42] font-medium">{t('batch.production.duration')}</span>
                          <p className="font-semibold text-[#573e1c]">{step.duration}</p>
                        </div>
                      </div>
                      
                      {step.temperature && (
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-[#8b6a42]" />
                          <div>
                            <span className="text-xs text-[#8b6a42] font-medium">{t('batch.production.temperature')}</span>
                            <p className="font-semibold text-[#573e1c]">{step.temperature}</p>
                          </div>
                        </div>
                      )}

                      {step.equipment && (
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4 text-[#8b6a42]" />
                          <div>
                            <span className="text-xs text-[#8b6a42] font-medium">{t('batch.production.equipment')}</span>
                            <p className="font-semibold text-[#573e1c]">
                              {language === 'vi' ? step.equipment : step.equipmentEn}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quality Check */}
                    {step.qualityCheck && (
                      <Card className="bg-[#f8f5f0] border-[#efe1c1]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#573e1c] flex items-center">
                              {step.qualityCheck.passed ? (
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600 mr-2" />
                              )}
                              {t('batch.production.qualityCheck')}
                            </h4>
                            <Badge className={step.qualityCheck.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {step.qualityCheck.passed ? t('batch.production.passed') : t('batch.production.failed')}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-3 h-3 text-[#8b6a42]" />
                              <span className="text-xs text-[#8b6a42]">{t('batch.production.inspector')}:</span>
                              <span className="text-sm font-medium text-[#573e1c]">{step.qualityCheck.inspector}</span>
                            </div>
                            
                            <p className="text-sm text-[#8b6a42]">
                              {language === 'vi' ? step.qualityCheck.notes : step.qualityCheck.notesEn}
                            </p>
                            
                            {step.qualityCheck.timestamp && (
                              <p className="text-xs text-[#8b6a42]">
                                {formatDate(step.qualityCheck.timestamp)}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Timestamp */}
                    {step.timestamp && (
                      <p className="text-xs text-[#8b6a42]">
                        {formatDate(step.timestamp)}
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