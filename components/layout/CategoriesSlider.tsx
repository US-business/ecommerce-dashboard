"use client"
import { useAppStore, useI18nStore } from '@/lib/stores'
import React from 'react'
import SliderRounded from '../ui/SliderRounded'

const CategoriesSlider = () => {

   const { dir } = useI18nStore()
   const { categories } = useAppStore()

   return (
      <>
      <SliderRounded items={categories} dir={dir} className="mx-auto" />
      </>
   )
}

export default CategoriesSlider