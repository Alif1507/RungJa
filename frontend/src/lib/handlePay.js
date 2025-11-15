export function handleSnapPayment(token) {
  return new Promise((resolve, reject) => {
    if (!window.snap || typeof window.snap.pay !== "function") {
      reject(new Error("Midtrans Snap is not loaded."));
      return;
    }

    window.snap.pay(token, {
      onSuccess: (result) => resolve(result),
      onPending: (result) => resolve(result),
      onError: (error) => reject(error),
      onClose: () => reject(new Error("Payment popup closed before finishing.")),
    });
  });
}
