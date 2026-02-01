// 导入语言模块 / Import language module
import { initLanguage, getText } from './languages/language-loader.js';

// 猫猫图片应用类 / Cat image application class
class CatImageApp {
  constructor() {
    this.init();
  }
  
  // 初始化应用 / Initialize application
  async init() {
    // 初始化语言 / Initialize language
    await initLanguage();
    
    // 获取DOM元素 / Get DOM elements
    this.fetchButton = document.getElementById('fetch-button');
    this.loadingIndicator = document.getElementById('loading');
    this.artistNameElement = document.getElementById('artist-name');
    this.artistLinkElement = document.getElementById('artist-link');
    this.sourceLinkElement = document.getElementById('source-link');
    this.apiStatusElement = document.getElementById('api-status');
    this.catImageElement = document.getElementById('cat-image');
    this.imagePlaceholder = document.getElementById('image-placeholder');
    this.apiUrl = 'https://nekos.best/api/v2/neko';
    
    // 设置图片alt属性 / Set image alt attribute
    this.catImageElement.alt = getText('imageAlt');
    
    // 绑定事件 / Bind events
    this.fetchButton.addEventListener('click', () => this.fetchCatImage());
    
    // 初始加载一张图片 / Load initial image
    this.fetchCatImage();
  }
  
  // 获取猫猫图片 / Fetch cat image
  async fetchCatImage() {
    try {
      // 更新UI状态 / Update UI state
      this.fetchButton.disabled = true;
      this.loadingIndicator.classList.add('active');
      this.apiStatusElement.textContent = getText('apiRequesting');
      
      // 清除之前的图片 / Clear previous image
      this.catImageElement.style.display = 'none';
      this.imagePlaceholder.textContent = getText('loadingImage');
      this.imagePlaceholder.style.display = 'block';
      
      // 添加时间戳防止缓存 / Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${this.apiUrl}?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(getText('httpError').replace('{status}', response.status));
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const catData = data.results[0];
        
        // 更新艺术家信息 / Update artist information
        this.artistNameElement.textContent = catData.artist_name || getText('unknownArtist');
        
        // 更新艺术家链接 / Update artist link
        if (catData.artist_href) {
          this.artistLinkElement.innerHTML = `<a href="${catData.artist_href}" target="_blank">${catData.artist_href}</a>`;
        } else {
          this.artistLinkElement.textContent = getText('noLinkAvailable');
        }
        
        // 更新图片来源链接 / Update image source link
        if (catData.source_url) {
          this.sourceLinkElement.innerHTML = `<a href="${catData.source_url}" target="_blank">${getText('artwork')}</a>`;
        } else {
          this.sourceLinkElement.textContent = getText('noSourceLink');
        }
        
        // 更新猫猫图片 / Update cat image
        this.catImageElement.src = catData.url;
        this.catImageElement.alt = getText('imageAltWithArtist').replace('{artist}', catData.artist_name || getText('unknownArtist'));
        
        // 图片加载成功处理 / Image load success handler
        this.catImageElement.onload = () => {
          this.catImageElement.style.display = 'block';
          this.imagePlaceholder.style.display = 'none';
          this.apiStatusElement.textContent = getText('apiSuccess');
          
          // 恢复按钮状态 / Restore button state
          this.fetchButton.disabled = false;
          this.loadingIndicator.classList.remove('active');
        };
        
        // 图片加载失败处理 / Image load failure handler
        this.catImageElement.onerror = () => {
          this.imagePlaceholder.textContent = getText('imageLoadFailed');
          this.imagePlaceholder.style.display = 'block';
          this.apiStatusElement.textContent = getText('imageLoadError');
          this.fetchButton.disabled = false;
          this.loadingIndicator.classList.remove('active');
        };
      } else {
        throw new Error(getText('apiDataError'));
      }
    } catch (error) {
      console.error(getText('fetchError'), error);
      
      // 更新错误状态 / Update error state
      this.apiStatusElement.textContent = `${getText('error')}: ${error.message}`;
      this.artistNameElement.textContent = getText('fetchFailed');
      this.artistLinkElement.textContent = getText('fetchFailed');
      this.sourceLinkElement.textContent = getText('fetchFailed');
      this.imagePlaceholder.textContent = getText('imageFetchFailed');
      this.imagePlaceholder.style.display = 'block';
      
      // 恢复按钮状态 / Restore button state
      this.fetchButton.disabled = false;
      this.loadingIndicator.classList.remove('active');
    }
  }
}

// 启动应用 / Start application
document.addEventListener('DOMContentLoaded', () => {
  new CatImageApp();
});