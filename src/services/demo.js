// Datos de muestra — se usan cuando el backend no está disponible

export const DEMO_REPORTE = {
  totalVentas: 1240000, totalDevoluciones: 28000,
  montoNeto: 1212000, numeroTransacciones: 55
}

export const DEMO_PUNTOS = [
  { id: 1, nombre: 'Tienda Norte',  region: 'Metropolitana', direccion: 'Av. Kennedy 5413' },
  { id: 2, nombre: 'Tienda Sur',    region: 'Biobío',        direccion: 'Caupolicán 88' },
  { id: 3, nombre: 'Tienda Centro', region: 'Metropolitana', direccion: 'Huérfanos 1160' },
]

export const DEMO_TRANSACCIONES = [
  { id: 12, fecha: '2026-07-08T10:00:00', tipo: 'VENTA',      productoCodigo: 'PROD-001', cantidad: 3,  monto: 89990 },
  { id: 11, fecha: '2026-07-08T09:30:00', tipo: 'VENTA',      productoCodigo: 'PROD-004', cantidad: 1,  monto: 149990 },
  { id: 10, fecha: '2026-07-08T09:15:00', tipo: 'DEVOLUCION', productoCodigo: 'PROD-002', cantidad: 2,  monto: 39990 },
  { id: 9,  fecha: '2026-07-07T16:45:00', tipo: 'VENTA',      productoCodigo: 'PROD-007', cantidad: 5,  monto: 24990 },
  { id: 8,  fecha: '2026-07-07T15:00:00', tipo: 'VENTA',      productoCodigo: 'PROD-003', cantidad: 2,  monto: 59990 },
]

export const DEMO_PEDIDOS = [
  { id: 52, clienteId: 3, fechaPedido: '2026-07-08T10:20:00', estado: 'PENDIENTE',  total: 89990,  items: [{cantidad:1}] },
  { id: 51, clienteId: 1, fechaPedido: '2026-07-08T09:00:00', estado: 'CONFIRMADO', total: 149990, items: [{cantidad:2}] },
  { id: 50, clienteId: 5, fechaPedido: '2026-07-07T18:00:00', estado: 'EN_ENVIO',   total: 59990,  items: [{cantidad:1}] },
  { id: 49, clienteId: 2, fechaPedido: '2026-07-07T12:30:00', estado: 'ENTREGADO',  total: 39990,  items: [{cantidad:3}] },
  { id: 48, clienteId: 4, fechaPedido: '2026-07-06T11:00:00', estado: 'ENTREGADO',  total: 24990,  items: [{cantidad:1}] },
  { id: 47, clienteId: 1, fechaPedido: '2026-07-06T09:15:00', estado: 'CANCELADO',  total: 99990,  items: [{cantidad:2}] },
]

export const DEMO_PRODUCTOS = [
  { id: 1, codigo: 'PROD-001', nombre: 'Laptop Pro 15"',     categoria: 'Computación', precio: 899990, activo: true },
  { id: 2, codigo: 'PROD-002', nombre: 'Mouse Inalámbrico',  categoria: 'Periféricos', precio: 19990,  activo: true },
  { id: 3, codigo: 'PROD-003', nombre: 'Teclado Mecánico',   categoria: 'Periféricos', precio: 59990,  activo: true },
  { id: 4, codigo: 'PROD-004', nombre: 'Monitor 27" 4K',     categoria: 'Monitores',   precio: 449990, activo: true },
  { id: 5, codigo: 'PROD-005', nombre: 'Auriculares BT',     categoria: 'Audio',       precio: 79990,  activo: true },
  { id: 6, codigo: 'PROD-006', nombre: 'Webcam HD',          categoria: 'Periféricos', precio: 34990,  activo: false },
]

export const DEMO_ALERTAS = [
  { id: 1, productoId: 2, productoNombre: 'Mouse Inalámbrico', almacen: 'Bodega Norte', cantidadActual: 3, umbralMinimo: 10 },
  { id: 2, productoId: 5, productoNombre: 'Auriculares BT',    almacen: 'Bodega Sur',   cantidadActual: 1, umbralMinimo: 5  },
]

export const DEMO_STOCK = [
  { id: 1, productoId: 1, almacen: 'Bodega Norte', cantidad: 25, umbralMinimo: 5  },
  { id: 2, productoId: 2, almacen: 'Bodega Norte', cantidad: 3,  umbralMinimo: 10 },
  { id: 3, productoId: 3, almacen: 'Bodega Sur',   cantidad: 18, umbralMinimo: 5  },
  { id: 4, productoId: 4, almacen: 'Bodega Norte', cantidad: 12, umbralMinimo: 3  },
  { id: 5, productoId: 5, almacen: 'Bodega Sur',   cantidad: 1,  umbralMinimo: 5  },
]

export const DEMO_KPIS = {
  totalIngresos: 1680000, totalEgresos: 830000,
  utilidadBruta: 850000,  margenRentabilidad: 51
}

export const DEMO_INGRESOS = [
  { id: 1, concepto: 'Ventas Tienda Norte', categoria: 'VENTAS',    fecha: '2026-07-08', monto: 850000 },
  { id: 2, concepto: 'Ventas Tienda Sur',   categoria: 'VENTAS',    fecha: '2026-07-07', monto: 520000 },
  { id: 3, concepto: 'Servicio técnico',    categoria: 'SERVICIOS', fecha: '2026-07-06', monto: 310000 },
]

export const DEMO_EGRESOS = [
  { id: 1, concepto: 'Arriendo local Norte', categoria: 'ARRIENDO',  fecha: '2026-07-01', monto: 350000 },
  { id: 2, concepto: 'Reposición stock',     categoria: 'COMPRAS',   fecha: '2026-07-05', monto: 280000 },
  { id: 3, concepto: 'Sueldos julio',        categoria: 'PERSONAL',  fecha: '2026-07-08', monto: 200000 },
]

export const DEMO_CLIENTES = [
  { id: 1, nombre: 'Ana',    apellido: 'González', email: 'ana@mail.com',    activo: true  },
  { id: 2, nombre: 'Carlos', apellido: 'Muñoz',    email: 'carlos@mail.com', activo: true  },
  { id: 3, nombre: 'María',  apellido: 'Soto',     email: 'maria@mail.com',  activo: true  },
  { id: 4, nombre: 'Diego',  apellido: 'Rojas',    email: 'diego@mail.com',  activo: false },
  { id: 5, nombre: 'Laura',  apellido: 'Pérez',    email: 'laura@mail.com',  activo: true  },
]

export const DEMO_TICKETS = [
  { id: 1, clienteId: 1, asunto: 'Problema con garantía',  estado: 'ABIERTO',    fechaCreacion: '2026-07-08' },
  { id: 2, clienteId: 3, asunto: 'Consulta sobre pedido',  estado: 'EN_PROCESO', fechaCreacion: '2026-07-07' },
  { id: 3, clienteId: 2, asunto: 'Cambio de producto',     estado: 'RESUELTO',   fechaCreacion: '2026-07-05' },
  { id: 4, clienteId: 5, asunto: 'Error en facturación',   estado: 'ABIERTO',    fechaCreacion: '2026-07-08' },
  { id: 5, clienteId: 1, asunto: 'Retraso en despacho',    estado: 'RESUELTO',   fechaCreacion: '2026-07-04' },
]
