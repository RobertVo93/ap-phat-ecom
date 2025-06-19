'use client';

import React from 'react';
import { Leaf, Award, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { IIngredient } from '@/types/batch.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BatchIngredientsProps {
  ingredients: IIngredient[];
}

export function BatchIngredients({ ingredients }: BatchIngredientsProps) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#573e1c] mb-2">
          {t('batch.ingredients.title')}
        </h2>
        <p className="text-[#8b6a42]">
          {t('batch.ingredients.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {ingredients.map((ingredient) => (
          <Card key={ingredient.id} className="bg-white border-[#d4c5a0] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Ingredient Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#573e1c] text-lg">
                        {language === 'vi' ? ingredient.name : ingredient.nameEn}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-[#8b6a42]">
                        <span>
                          {t('batch.ingredients.weight')}: {ingredient.weight}{ingredient.unit}
                        </span>
                        <span>
                          {t('batch.ingredients.percentage')}: {ingredient.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${ingredient.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Origin Information */}
                {ingredient.origin && (
                  <div className="lg:w-1/2">
                    <Card className="bg-[#f8f5f0] border-[#efe1c1]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#573e1c] text-base flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {t('batch.ingredients.origin')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="text-xs text-[#8b6a42] font-medium uppercase tracking-wide">
                            {t('batch.ingredients.supplier')}
                          </span>
                          <p className="font-semibold text-[#573e1c]">
                            {language === 'vi' ? ingredient.origin.supplier : ingredient.origin.supplierEn}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-xs text-[#8b6a42] font-medium uppercase tracking-wide">
                            {t('batch.ingredients.region')}
                          </span>
                          <p className="text-[#573e1c]">
                            {language === 'vi' ? ingredient.origin.region : ingredient.origin.regionEn}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-[#8b6a42] leading-relaxed">
                            {language === 'vi' ? ingredient.origin.description : ingredient.origin.descriptionEn}
                          </p>
                        </div>

                        {/* Certifications */}
                        {ingredient.origin.certifications && ingredient.origin.certifications.length > 0 && (
                          <div>
                            <span className="text-xs text-[#8b6a42] font-medium uppercase tracking-wide flex items-center mb-2">
                              <Award className="w-3 h-3 mr-1" />
                              {t('batch.ingredients.certifications')}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {(language === 'vi' ? ingredient.origin.certifications : ingredient.origin.certificationsEn || ingredient.origin.certifications).map((cert, index) => (
                                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}