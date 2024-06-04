import { CSSProperties, useEffect, useState } from 'react';
import { Image, Skeleton } from 'antd';
import { useReadLocalStorage } from 'usehooks-ts';
import defaultImage from '@/assets/images/default-image.png';
import defaultAvatar from '@/assets/images/default-avatar.svg';

/**
 * A custom image component with support for caching and tokenization.
 * @typedef {import('react').CSSProperties} CSSProperties
 *
 * @typedef {Object} IProps
 * @property {boolean} [useCach=false] - Indicates whether to use caching for the image.
 * @property {boolean} [tokenized=false] - Indicates whether the image requires tokenization for access.
 * @property {boolean} [circle=false] - Indicates whether the image should be displayed in a circular shape.
 * @property {string} src - The URL of the image to be displayed.
 * @property {string} [id] - The unique identifier of the image component.
 * @property {string} [defaultSrc=defaultImage] - The default image source in case the provided source fails to load.
 * @property {CSSProperties} [style] - Additional CSS styles to be applied to the image.
 * @property {string | number} [key] - The unique key of the image component.
 * @property {string} [className] - The CSS class name(s) to be applied to the image.
 * @property {boolean} [preview=false] - Indicates whether to enable image preview.
 * @property {'common' | 'avatar'} [imgType='common'] - The type of image ('common' or 'avatar').
 * @property {() => void} [onClick] - Callback function triggered when the image is clicked.
 *
 * @param {IProps} props - Props for the TokenizedImage component.
 * @returns {JSX.Element} - JSX element representing the TokenizedImage component.
 *
 * @example
 * //Usage example
 * import React from 'react';
 * import TokenizedImage from './TokenizedImage';
 *
 * function ExampleComponent() {
 *   return (
 *     <TokenizedImage
 *       src="https://example.com/image.jpg"
 *       useCach={true}
 *       tokenized={false}
 *       defaultSrc="https://example.com/default-image.jpg"
 *       style={{ width: 200, height: 200 }}
 *       circle={true}
 *       imgType="common"
 *       onClick={() => console.log('Image clicked')}
 *     />
 *   );
 * }
 *
 * export default ExampleComponent;
 */

interface IProps {
  useCach?: boolean;
  tokenized?: boolean;
  circle?: boolean;
  src: string;
  id?: string;
  defaultSrc?: string;
  style?: CSSProperties;
  key?: string | number;
  className?: string;
  preview?: boolean;
  imgType?: 'common' | 'avatar';
  onClick?: () => void;
}

function TokenizedImage({
  useCach = false,
  tokenized = false,
  src,
  id,
  defaultSrc = defaultImage,
  style,
  preview = false,
  key,
  className,
  circle = false,
  imgType = 'common',
  onClick
}: IProps) {
  const userToken = useReadLocalStorage<any>('userToken');

  const [imageUrl, setImageUrl] = useState('');
  const [skeleton, setSkeleton] = useState(false);

  const fetchImageCacher = async () => {
    try {
      setSkeleton(true);
      if (useCach) {
        const cache = await caches?.open('imageCache');
        const cachedResponse = await cache.match(src);
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } else {
          const headers = new Headers();
          tokenized && headers.append('AuthPerson', userToken);
          const response = await fetch(src, {
            headers
          });
          if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            src && (await cache.put(src, new Response(blob)));

            setImageUrl(objectUrl);
          } else {
            console.error('error 1');
          }
        }
      } else if (tokenized) {
        const response = await fetch(src, {
          headers: {
            Authperson: userToken
          }
        });
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } else {
          console.error('error 2');
        }
      } else {
        setImageUrl(src);
      }
    } catch (error) {
      console.error('error 3', error);
    } finally {
      setSkeleton(false);
    }
  };

  useEffect(() => {
    src && fetchImageCacher();
    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [src]);

  return (
    // eslint-disable-next-line no-nested-ternary
    !skeleton ? (
      <Image
        className={className}
        src={imageUrl}
        fallback={imgType === 'common' ? defaultSrc : defaultAvatar}
        key={key?.toString()}
        style={{ ...style, objectFit: 'contain' }}
        aria-hidden
        id={id}
        preview={preview}
        onClick={onClick}
        placeholder={
          circle ? (
            <Skeleton.Avatar style={style} active />
          ) : (
            <Skeleton style={style} active />
          )
        }
        alt=""
      />
    ) : imgType === 'common' ? (
      <Skeleton.Image style={style} active />
    ) : (
      <Skeleton.Avatar active />
    )
  );
}

export default TokenizedImage;
