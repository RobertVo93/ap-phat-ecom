'use client';

import React from 'react';
import { Award, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { IBatchDetailComplete } from '@/types/batch.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BatchQualityProps {
  qualityAssurance: IBatchDetailComplete['qualityAssurance'];
  formatDate: (date: string) => string;
}

export function BatchQuality({ qualityAssurance, formatDate }: BatchQualityProps) {
  const { language, t } = useLanguage();

  if (!qualityAssurance) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#573e1c] mb-2">
          {t('batch.quality.title')}
        </h2>
        <p className="text-[#8b6a42]">
          {t('batch.quality.subtitle')}
        </p>
      </div>

      {/* Certifications */}
      {qualityAssurance.certifications && qualityAssurance.certifications.length > 0 && (
        <Card className="bg-white border-[#d4c5a0]">
          <CardHeader>
            <CardTitle className="text-[#573e1c] flex items-center">
              <Award className="w-5 h-5 mr-2" />
              {t('batch.quality.certifications')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(language === 'vi' ? qualityAssurance.certifications : qualityAssurance.certificationsEn || qualityAssurance.certifications).map((certification, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-[#f8f5f0] rounded-lg border border-[#efe1c1]">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#573e1c] text-sm leading-tight">
                      {certification}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {qualityAssurance.testResults && qualityAssurance.testResults.length > 0 && (
        <Card className="bg-white border-[#d4c5a0]">
          <CardHeader>
            <CardTitle className="text-[#573e1c] flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {t('batch.quality.testResults')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityAssurance.testResults.map((test, index) => (
                <Card key={index} className="bg-[#f8f5f0] border-[#efe1c1]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-[#573e1c]">
                        {language === 'vi' ? test.testType : test.testTypeEn}
                      </h4>
                      <Badge className={test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {test.passed ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {test.passed ? t('batch.production.passed') : t('batch.production.failed')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-[#8b6a42] font-medium uppercase tracking-wide">
                          {t('batch.quality.result')}
                        </span>
                        <p className="font-semibold text-[#573e1c]">
                          {language === 'vi' ? test.result : test.resultEn}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-[#8b6a42] font-medium uppercase tracking-wide">
                          {t('batch.quality.standard')}
                        </span>
                        <p className="font-semibold text-[#573e1c]">{test.standard}</p>
                      </div>
                    </div>
                    
                    {test.timestamp && (
                      <p className="text-xs text-[#8b6a42] mt-3">
                        {formatDate(test.timestamp)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}