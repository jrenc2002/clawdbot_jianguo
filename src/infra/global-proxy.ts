/**
 * Global proxy configuration for Node.js fetch (undici).
 *
 * Node.js's built-in fetch (based on undici) does NOT respect
 * HTTP_PROXY/HTTPS_PROXY environment variables by default.
 * This module sets up a global dispatcher to route all fetch
 * requests through a proxy when configured.
 */
import { ProxyAgent, setGlobalDispatcher, Agent } from "undici";
import { createSubsystemLogger } from "../logging/subsystem.js";

const log = createSubsystemLogger("proxy");

let proxyInitialized = false;

/**
 * Initialize global proxy for all fetch requests.
 * Should be called early in the application lifecycle.
 */
export function initGlobalProxy(): void {
  if (proxyInitialized) return;
  proxyInitialized = true;

  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    process.env.ALL_PROXY ||
    process.env.all_proxy;

  if (!proxyUrl) {
    return;
  }

  try {
    const agent = new ProxyAgent(proxyUrl);
    setGlobalDispatcher(agent);
    log.info(`global proxy enabled: ${proxyUrl}`);
  } catch (err) {
    log.error(`failed to set global proxy: ${String(err)}`);
  }
}
