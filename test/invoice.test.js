var test = require('node:test');
var assert = require('node:assert/strict');
var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

function summary(figures) {
  return {
    subtotal: figures.subtotal,
    discount: figures.discount,
    tax: figures.tax,
    cgst: figures.cgst,
    sgst: figures.sgst,
    total: figures.total
  };
}

test('CURRENT BEHAVIOUR: invoice #1001 uses explicit 5% and 12% GST rates with no coupon', function () {
  var order = {
    coupon: '',
    items: [
      { name: 'Rice', sku: 'RICE-5', hsn: '1006', gstRate: 5, price: 280, qty: 1 },
      { name: 'Ghee', sku: 'GHEE-12', hsn: '0405', gstRate: 12, price: 330, qty: 1 }
    ]
  };
  var invoiceFigures = invoice.computeInvoiceFigures(order);
  var checkoutFigures = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(summary(invoiceFigures), {
    subtotal: 610, discount: 0, tax: 53.6, cgst: 26.8, sgst: 26.8, total: 663.6
  });
  assert.deepEqual(invoiceFigures.rows, [
    { name: 'Rice', sku: 'RICE-5', hsn: '1006', qty: 1, price: 280, gstPercent: 5, line: 280, lineTax: 14 },
    { name: 'Ghee', sku: 'GHEE-12', hsn: '0405', qty: 1, price: 330, gstPercent: 12, line: 330, lineTax: 39.6 }
  ]);
  assert.deepEqual(summary(checkoutFigures), summary(invoiceFigures));
});

test('CURRENT BEHAVIOUR: invoice #1002 calculates SAVE10 after GST while checkout discounts before GST', function () {
  var order = {
    coupon: 'SAVE10',
    items: [
      { name: 'Rice', sku: 'RICE-5', hsn: '1006', gstRate: 5, price: 640, qty: 1 },
      { name: 'Sunflower Oil', sku: 'OIL-5', hsn: '1512', gstRate: 5, price: 190, qty: 2 }
    ]
  };
  var invoiceFigures = invoice.computeInvoiceFigures(order);
  var checkoutFigures = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(summary(invoiceFigures), {
    subtotal: 1020, discount: 107.1, tax: 51, cgst: 25.5, sgst: 25.5, total: 963.9
  });
  assert.deepEqual(invoiceFigures.rows, [
    { name: 'Rice', sku: 'RICE-5', hsn: '1006', qty: 1, price: 640, gstPercent: 5, line: 640, lineTax: 32 },
    { name: 'Sunflower Oil', sku: 'OIL-5', hsn: '1512', qty: 2, price: 190, gstPercent: 5, line: 380, lineTax: 19 }
  ]);
  assert.deepEqual(summary(checkoutFigures), {
    subtotal: 1020, discount: 102, tax: 45.9, cgst: 22.95, sgst: 22.95, total: 963.9
  });
});

test('CURRENT BEHAVIOUR: invoice #1004 does not apply SAVE10 maximum discount cap', function () {
  var order = {
    coupon: 'SAVE10',
    items: [
      { name: 'Groundnut Oil', sku: 'OIL-5L', hsn: '1508', gstRate: 5, price: 1120, qty: 2 }
    ]
  };
  var invoiceFigures = invoice.computeInvoiceFigures(order);
  var checkoutFigures = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(summary(invoiceFigures), {
    subtotal: 2240, discount: 235.2, tax: 112, cgst: 56, sgst: 56, total: 2116.8
  });
  assert.deepEqual(invoiceFigures.rows, [
    { name: 'Groundnut Oil', sku: 'OIL-5L', hsn: '1508', qty: 2, price: 1120, gstPercent: 5, line: 2240, lineTax: 112 }
  ]);
  assert.deepEqual(summary(checkoutFigures), {
    subtotal: 2240, discount: 150, tax: 104.5, cgst: 52.25, sgst: 52.25, total: 2194.5
  });
});

test('CURRENT BEHAVIOUR: invoice #1008 matches checkout for 18% items without a coupon', function () {
  var order = {
    coupon: '',
    items: [
      { name: 'Tea', sku: 'TEA-18', hsn: '0902', gstRate: 18, price: 140, qty: 1 },
      { name: 'Kokum Concentrate', sku: 'KOKUM-18', hsn: '2106', gstRate: 18, price: 180, qty: 2 }
    ]
  };
  var invoiceFigures = invoice.computeInvoiceFigures(order);
  var checkoutFigures = pricing.computeTotals(order.items, order.coupon);

  assert.deepEqual(summary(invoiceFigures), {
    subtotal: 500, discount: 0, tax: 90, cgst: 45, sgst: 45, total: 590
  });
  assert.deepEqual(invoiceFigures.rows, [
    { name: 'Tea', sku: 'TEA-18', hsn: '0902', qty: 1, price: 140, gstPercent: 18, line: 140, lineTax: 25.2 },
    { name: 'Kokum Concentrate', sku: 'KOKUM-18', hsn: '2106', qty: 2, price: 180, gstPercent: 18, line: 360, lineTax: 64.8 }
  ]);
  assert.deepEqual(summary(checkoutFigures), summary(invoiceFigures));
});
