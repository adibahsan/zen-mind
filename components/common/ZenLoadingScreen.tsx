import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

interface ZenLoadingScreenProps {
  size?: number;
}

export const ZenLoadingScreen: React.FC<ZenLoadingScreenProps> = ({ 
  size = Math.min(width, height) * 0.4 
}) => {
  const svgHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .zen-text {
          color: #8e7dbe;
          font-size: 18px;
          font-weight: 500;
          text-align: center;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <div class="loading-container">
        <svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lotusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#e8a87c;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#d88c9a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8e7dbe;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f7d6e0;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#e8a87c;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Background circle with breathing effect -->
          <circle cx="60" cy="60" r="45" fill="none" stroke="#f0f0f0" stroke-width="1" opacity="0.3">
            <animate attributeName="r" values="45;50;45" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          
          <!-- Lotus petals -->
          <g transform="translate(60, 60)">
            <!-- Petal 1 -->
            <path d="M 0,-25 C -15,-15 -15,15 0,25 C 15,15 15,-15 0,-25" 
                  fill="url(#lotusGradient)" 
                  opacity="0.8">
              <animateTransform attributeName="transform" 
                                type="rotate" 
                                values="0 0 0;360 0 0" 
                                dur="8s" 
                                repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
            </path>
            
            <!-- Petal 2 -->
            <path d="M 0,-25 C -15,-15 -15,15 0,25 C 15,15 15,-15 0,-25" 
                  fill="url(#lotusGradient)" 
                  opacity="0.7"
                  transform="rotate(72)">
              <animateTransform attributeName="transform" 
                                type="rotate" 
                                values="72 0 0;432 0 0" 
                                dur="8s" 
                                repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3.5s" repeatCount="indefinite" />
            </path>
            
            <!-- Petal 3 -->
            <path d="M 0,-25 C -15,-15 -15,15 0,25 C 15,15 15,-15 0,-25" 
                  fill="url(#lotusGradient)" 
                  opacity="0.6"
                  transform="rotate(144)">
              <animateTransform attributeName="transform" 
                                type="rotate" 
                                values="144 0 0;504 0 0" 
                                dur="8s" 
                                repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
            </path>
            
            <!-- Petal 4 -->
            <path d="M 0,-25 C -15,-15 -15,15 0,25 C 15,15 15,-15 0,-25" 
                  fill="url(#lotusGradient)" 
                  opacity="0.7"
                  transform="rotate(216)">
              <animateTransform attributeName="transform" 
                                type="rotate" 
                                values="216 0 0;576 0 0" 
                                dur="8s" 
                                repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3.2s" repeatCount="indefinite" />
            </path>
            
            <!-- Petal 5 -->
            <path d="M 0,-25 C -15,-15 -15,15 0,25 C 15,15 15,-15 0,-25" 
                  fill="url(#lotusGradient)" 
                  opacity="0.8"
                  transform="rotate(288)">
              <animateTransform attributeName="transform" 
                                type="rotate" 
                                values="288 0 0;648 0 0" 
                                dur="8s" 
                                repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3.8s" repeatCount="indefinite" />
            </path>
          </g>
          
          <!-- Center circle -->
          <circle cx="60" cy="60" r="8" fill="url(#centerGradient)">
            <animate attributeName="r" values="8;12;8" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.7;1" dur="4s" repeatCount="indefinite" />
          </circle>
          
          <!-- Zen symbol (Enso) -->
          <circle cx="60" cy="60" r="35" fill="none" stroke="#8e7dbe" stroke-width="2" stroke-linecap="round" opacity="0.6">
            <animate attributeName="stroke-dasharray" values="0 220;220 0;0 220" dur="6s" repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" values="220;0;220" dur="6s" repeatCount="indefinite" />
          </circle>
          
          <!-- Gentle pulsing dots around -->
          <circle cx="60" cy="15" r="2" fill="#d88c9a" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="105" cy="60" r="2" fill="#d88c9a" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="105" r="2" fill="#d88c9a" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="15" cy="60" r="2" fill="#d88c9a" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" begin="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div class="zen-text">Finding your zen...</div>
      </div>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: svgHtml }}
        style={styles.webview}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default ZenLoadingScreen; 