Usted ha sido contratado como desarrollador backend para una importante empresa
comercializadora de productos de aseo, esta empresa realiza órdenes de compra de los
productos requeridos en su operación y órdenes de ventas de los productos vendidos sus
clientes. Tanto las órdenes de compra como las órdenes de venta están siendo diligenciadas
manualmente por el área de contabilidad y quieren hacer un sistema que facilite esta gestión.
El sistema deberá registrar órdenes de compra con la siguiente información:

- id, fecha, cantidad, idProducto, nombreProducto

El sistema deberá registrar órdenes de venta con la siguiente información:

- id, fecha, cantidad, idProducto, nombreProducto

Como responsable del proyecto del lado del backend usted debe diseñar un microservicio en
NodeJs con el siguiente API rest:

- POST -> /registrar-compra - permite registrar una compra de producto y agregar stock al
inventario
- POST -> /registrar-venta - permite registrar una venta de producto y disminuir stock del
inventario

Consideraciones:

- No existe ningún producto en el stock cuando se inicia la operación
- El límite de compras en el mes para un producto no debe exceder la cantidad de 30
unidades.
- No se puede realizar una orden de venta si no existe stock disponible
- PISTA -> La fecha de la orden de compra indica cuando existe disponibilidad en el
inventario para determinado producto.
- PISTA -> FIFO (first-in, first-out)

Entregables

- Código fuente en repositorio en Github
- Documentación del proyecto que considere importante

Bonus
- Usar una base de datos para el almacenamiento de los datos
- Pruebas unitarias
- Usar contenedores de docker
- Usar alguna herramienta de linting (Eslint)
- Tipo de arquitectura implementada en el ejercicio
