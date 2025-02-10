<?php
/*
	Este archivo define un repositorio visual de colores utilizando una lista de colores CSS3. 
	Cada color se muestra como un elemento dentro de un contenedor, 
	y se aplican estilos CSS y funcionalidad JavaScript para permitir la navegación interactiva a través de los elementos con la rueda del ratón.
 */
?>
<div id="repositorio">
	<div id="contenedor">
		<?php
		include "lib/colores.php";
		foreach ($css3_colors as $color) {
			echo '<div class="elemento activo" style="background:' . $color . ';"></div>';
		}
		?>
	</div>
</div>

<style>
	<?php include "repositorio.css"; ?>
</style>
<script>
	<?php include "repositorio.js"; ?>
</script>