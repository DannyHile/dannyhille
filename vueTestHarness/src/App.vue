<script setup>
import  appDialog  from './components/AppDialog.vue';

function showDialog() {
    const dialog = document.getElementById('appMainDialog');
    dialog.showModal();
}

</script>


<template>
    <app-dialog caption="test">
        stuff here
    </app-dialog>
    <button @click="showDialog">Show Dialog</button>
</template>



<style>
</style>