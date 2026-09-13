import { ref } from 'vue';

import { getSystemConfig } from '#/api/quartz/system-config';
import type { SystemConfigDto } from '#/api/quartz/system-config';

/**
 * 全局系统配置状态（模块级单例）
 * 供应用标题、分析页横幅等共享
 */
const systemConfig = ref<SystemConfigDto>({
  serviceName: '',
  environment: 'DEV',
  serviceDescription: '',
});

let loaded = false;
let loadingPromise: Promise<void> | null = null;

/**
 * 加载系统配置（全局单次，重复调用会复用结果）
 * 失败时静默处理，不影响主流程
 */
export async function loadSystemConfig(): Promise<void> {
  if (loaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const response = (await getSystemConfig()) as any;
      const data: SystemConfigDto = response?.data ?? response;
      systemConfig.value = {
        serviceName: data?.serviceName || '',
        environment: data?.environment || 'DEV',
        serviceDescription: data?.serviceDescription || '',
      };
      // 仅成功时标记已加载，失败时允许后续重试（如 401 过期后重新登录）
      loaded = true;
    } catch (error) {
      // 静默失败，不影响主流程；loaded 保持 false，下次会重试
      console.error('加载系统配置失败', error);
    } finally {
      loadingPromise = null;
    }
  })();
  return loadingPromise;
}

/**
 * 重置加载状态（登出后重新登录时使用）
 */
export function resetSystemConfig() {
  systemConfig.value = {
    serviceName: '',
    environment: 'DEV',
    serviceDescription: '',
  };
  loaded = false;
  loadingPromise = null;
}

export function useSystemConfig() {
  return { systemConfig, loadSystemConfig, resetSystemConfig };
}
