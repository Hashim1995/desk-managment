import { CSSProperties, useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { useReadLocalStorage } from 'usehooks-ts';
import { DotChartOutlined } from '@ant-design/icons';

/**
 * A custom iframe component with support for tokenization.
 * @typedef {import('react').CSSProperties} CSSProperties
 *
 * @typedef {Object} IProps
 * @property {boolean} [tokenized=false] - Indicates whether tokenization is required for accessing the iframe content.
 * @property {string} [title] - The title of the iframe.
 * @property {string} src - The URL of the iframe content.
 * @property {string} [id] - The unique identifier of the iframe component.
 * @property {CSSProperties} [style] - Additional CSS styles to be applied to the iframe.
 * @property {string | number} [key] - The unique key of the iframe component.
 * @property {string} [className] - The CSS class name(s) to be applied to the iframe.
 * @property {() => void} [onClick] - Callback function triggered when the iframe is clicked.
 *
 * @param {IProps} props - Props for the TokenizedIframe component.
 * @returns {JSX.Element} - JSX element representing the TokenizedIframe component.
 *
 * @example
 * // Usage example
 * import React from 'react';
 * import TokenizedIframe from './TokenizedIframe';
 *
 * function ExampleComponent() {
 *   return (
 *     <TokenizedIframe
 *       src="https://example.com"
 *       tokenized={true}
 *       title="Example Iframe"
 *       style={{ width: '100%', height: 500 }}
 *       className="custom-iframe"
 *       onClick={() => console.log('Iframe clicked')}
 *     />
 *   );
 * }
 *
 * export default ExampleComponent;
 */

interface IProps {
  tokenized?: boolean;
  title?: string;
  src: string;
  id?: string;
  style?: CSSProperties;
  key?: string | number;
  className?: string;
  onClick?: () => void;
}

function TokenizedIframe({
  tokenized = false,
  title,
  src,
  style,
  key,
  className,
  id,
  onClick
}: IProps) {
  const token = useReadLocalStorage<any>('userToken');

  const [iframeUrl, setIframeUrl] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const fetchImage = async () => {
    setLoading(true);
    if (tokenized) {
      try {
        const response = await fetch(src, {
          headers: {
            Authperson: token
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setIframeUrl(objectUrl);
        } else {
          console.error('error 1');
        }
      } catch (error) {
        console.error('error 2', error);
      } finally {
        setLoading(false);
      }
    } else {
      setIframeUrl(src);
    }
  };
  useEffect(() => {
    fetchImage();

    return () => URL.revokeObjectURL(iframeUrl);
  }, [src]);
  console.log(style, 'style');

  return (
    <div style={{ height: '100%' }}>
      {iframeUrl && !loading ? (
        <iframe
          width="100%"
          title={title}
          className={className}
          src={iframeUrl}
          key={key}
          style={style}
          aria-hidden
          onClick={onClick}
          id={id}
        />
      ) : (
        <Skeleton.Node style={style} className={`w-full ${className}`} active>
          <DotChartOutlined
            rev={undefined}
            style={{ fontSize: 40, color: '#bfbfbf' }}
          />
        </Skeleton.Node>
      )}
    </div>
  );
}

export default TokenizedIframe;
