import * as Sentry from "@sentry/node"
import { ProfilingIntegration } from "@sentry/profiling-node"
import { sentryDSN } from "../config"
const sentryConfig = {
  dsn: sentryDSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express(),
    new ProfilingIntegration(),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.OnUncaughtException(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
}
export default sentryConfig
