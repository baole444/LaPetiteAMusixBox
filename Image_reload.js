import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Canvas, Image as SkiaImage, useImage } from '@shopify/react-native-skia';

/**
 * A React component to load and display an image using Skia.
 * Use to load Image from source, fallback when failed.
 *
 * @param {string|require} src - The source of the image to load. Can be link or an asset(require method).
 * @param {number} [scale=1] - (Optional) The scaling factor for the image dimensions.
 * @param {string|number} [fallback] - (Optional) A fallback image to display if the main image fails to load. Defaults to a broken image icon.
 * @returns {JSX.Element} The rendered image component or a loading indicator.
 */

const Image_reload = ({src, scale = 1, fallback = require('./assets/texture/file_broken.png')}) => {
  const img = useImage(src);
  const fallbackImg = useImage(fallback);
  const [imgLoad, setImgLoad] = useState(false);
  const [imgSize, setImgSize] = useState({w: 0, h: 0});

  useEffect(() => {
    if(img) {
      //console.log('Image loaded.');
      const w = img.width() * (scale || 1);
      const h = img.height() * (scale || 1);
      //console.log('Dimension: ', {w, h});
      setImgSize({w, h});
      setImgLoad(true);
    } else if (fallbackImg) {
      //console.log('Failed to load image, falling back.')
      const w = fallbackImg.width();
      const h = fallbackImg.height();
      //console.log('Dimension: ', {w, h});
      setImgSize({w, h});
      setImgLoad(true);
    } else {
      //console.log('Image failed to load.')
      setImgLoad(false);
    }
  }, [img, fallbackImg, scale]);

  return(
    <View style={{ alignItems: 'center'}}>
      {imgLoad ? (
          <Canvas style={{width: imgSize.w, height: imgSize.h}}>
            <SkiaImage 
              image ={img || fallbackImg} 
              x={0} 
              y={0} 
              width={imgSize.w} 
              height={imgSize.h} 
              fit="contain" 
              />
          </Canvas>
      ): (<ActivityIndicator size='large' color="white"/>)}

    </View>
  );
};

export default Image_reload;    
