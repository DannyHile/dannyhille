<template>
    <main>
        <app-dialog caption="test">
            stuff here
        </app-dialog>
        <h1>{{ caption }}</h1>
        <button @click="count++">count is: {{ count }}</button>
        <hr />
        <div v-if="timeSlots">
            <h2>Time Slots</h2>
            <ul style="padding-left:0;list-style:none">
                <li v-for="(slot,idx) in timeSlots"
                    style="display:inline-block;float:inline-end;margin:5px;background:red;padding:15px;">
                    {{ Object.keys(slot)[0].substring(5,10) }}
                </li>
            </ul>
        </div>

    <br />
    <button @click="showDialog">Show Dialog</button>

    </main>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import  appDialog  from './AppDialog.vue';

    const count = ref(0);
    const timeSlots = ref(null)
    defineProps({
        caption: {type:String, default:'Dialog' }
    });

    onMounted(async () => {
        console.log('main-app:mounted');
        timeSlots.value = window.slots= await loadData();
        const arr= [];
        for(let day of window.slots){
            //console.log('date: %o', Object.keys(day)[0]);
            for(let dayid in day){
                const timeSlots = day[dayid];
                for(let slot of timeSlots){
                    //console.log('\ttime: %o', Object.keys(slot)[0]);
                    for(let id in slot){
                        const allocs = slot[id];
                        for(let alloc of allocs){
                            //console.log('\t\talloc: %o', alloc.AllocationId);
                            arr.push({
                                date:dayid.substring(0,10), 
                                from:alloc.From.substring(11,16),
                                to:alloc.To.substring(11,16),
                                allocationId:alloc.AllocationId,
                                departmentId:alloc.DepartmentId,
                                meetingTypeId:alloc.MeetingTypeId,
                                meetingForms:alloc.MeetingForms.join(','),
                            });
                        }
                    }
                    
                }
            }
        }
        console.table(arr);
    });

    async function loadData(){
        const resp = await fetch('./data.json');
        return await resp.json();
    }
    function showDialog() {
        const dialog = document.getElementById('appMainDialog');
        dialog.showModal();
    }

    
</script>
<style scoped></style>