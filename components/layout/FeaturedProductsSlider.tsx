"use client"

import { useAppStore, useI18nStore } from '@/lib/stores'
import React from 'react'
import Slider from '../ui/Slider'

const FeaturedProductsSlider = () => {

   const { dir } = useI18nStore()
   const { featuredProductsList } = useAppStore()

   return (
      <>
         <Slider items={featuredProductsList} dir={dir} />
      </>
   )
}

export default FeaturedProductsSlider