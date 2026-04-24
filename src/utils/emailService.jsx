// Temporary email service that works immediately
export const emailService = {
  sendOrderNotification: async (orderData) => {
    try {
      console.log('📧 ADMIN ORDER NOTIFICATION:', {
        orderId: orderData.id,
        customer: orderData.customer.fullName,
        phone: orderData.customer.phone,
        total: `KSh ${orderData.total}`,
        items: orderData.items.map(item => `${item.quantity}x ${item.title}`),
        address: `${orderData.customer.estate}, ${orderData.customer.county}`
      });
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just return success - we'll add real email later
      return { 
        success: true, 
        message: 'Order logged successfully. Email will be sent in production.' 
      };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, message: 'Failed to send notification' };
    }
  },

  sendCustomerConfirmation: async (orderData) => {
    try {
      if (!orderData.customer.email) {
        console.log('📧 No customer email provided - skipping confirmation');
        return { success: true, message: 'No email provided' };
      }

      console.log('📧 CUSTOMER CONFIRMATION:', {
        to: orderData.customer.email,
        orderId: orderData.id,
        customer: orderData.customer.fullName,
        total: `KSh ${orderData.total}`,
        delivery: orderData.customer.deliveryOption
      });
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: 'Customer confirmation logged' 
      };
    } catch (error) {
      console.error('Customer email error:', error);
      return { success: false, message: 'Failed to send customer confirmation' };
    }
  }
};