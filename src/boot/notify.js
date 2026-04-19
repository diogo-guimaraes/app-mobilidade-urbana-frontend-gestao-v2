import { boot } from "quasar/wrappers";
import { Notify } from "quasar";

/**
 * Exibe uma notificação de sucesso
 * @param {string} message
 * @param {string} caption
 */
const success = (message, caption = "") => {
  const params = {
    group: false,
    multiLine: true,
    position: "top",
    type: "positive",
    message,
  };
  if (caption) params.caption = caption;
  return Notify.create(params);
};

/**
 * Exibe uma notificação de alerta
 * @param {string} message
 * @param {string} caption
 */
const warning = (message, caption = "") => {
  const params = {
    group: false,
    multiLine: true,
    position: "top",
    type: "warning",
    message,
  };
  if (caption) params.caption = caption;
  return Notify.create(params);
};

/**
 * Exibe uma notificação de erro
 * @param {string} message
 * @param {string} caption
 */
const error = (message, caption = "") => {
  const params = {
    group: false,
    multiLine: true,
    position: "top",
    type: "negative",
    message,
  };
  if (caption) params.caption = caption;
  return Notify.create(params);
};

/**
 * Exibe uma notificação customizada
 * @param {import("quasar").QNotifyCreateOptions} params
 */
const customNotify = (params) => {
  return Notify.create(params);
};

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default boot(({ app }) => {
  app.config.globalProperties.$notify = {
    success,
    warning,
    error,
    custom: customNotify,
  };
});

export { success, warning, error, customNotify };
