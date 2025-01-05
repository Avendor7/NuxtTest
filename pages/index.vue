<template>
    <main class="flex-col-center">


        <color-picker :isOpen="isModalOpened" @modal-close="closeModal"/>
        <div class="inputContainer">
            <input class="searchBox" type="text" v-model="query" :placeholder="'Search'" @keydown.enter="fetchData">
            <FontAwesomeIcon @click="openModal" :icon="faGear" class="settingsIcon"/>
        </div>
        <div v-if="hasLoaded" class="resource">
            <table>
                <thead>
                <tr>
                    <th>Source</th>
                    <th>Name</th>
                    <th>Version</th>
                    <th>Last Updated Date</th>
                    <th>Flagged Date</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="result in data" :key="result.name">
                    <td>{{ result.source }}</td>
                    <td v-if="result.source == 'ALR'">
                        <NuxtLink :to="{ name: 'ALR', params: { query: result.name }}">
                            {{ result.name }}
                        </NuxtLink>
                    </td>
                    <td v-else-if="result.source == 'AUR'">
                        <NuxtLink :to="{ name: 'AUR', params: { query: result.name }}">
                            {{ result.name }}
                        </NuxtLink>
                    </td>
                    <td>{{ result.version }}</td>
                    <td>{{ formatDate(result.last_updated_date) }}</td>
                    <td>{{ formatDate(result.flagged_date) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="isLoading">Loading...</div>
        <div v-else></div>
    </main>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";

import axios from "axios";
import ColorPicker from "@/components/ColorPicker.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { useRoute, useRouter } from 'vue-router';

const data = ref<Result[]>([]);

const query = ref("");
const isLoading = ref(false);
const hasLoaded = ref(false);
const isFocusing = ref(false);

const route = useRoute();
const router = useRouter();

interface Result {
    source: string;
    name: string;
    version: string;
    last_updated_date: Date;
    flagged_date: Date;
}

function fetchData() {
    isLoading.value = true;
    let baseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '/api';
    let url = `${baseUrl}/search?value=${encodeURIComponent(query.value)}`;

    console.log(url);
    axios
        .get(url)
        .then((response) => {
            data.value = response.data;
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            isLoading.value = false;
            hasLoaded.value = true;
            //router.push({ name: 'home', query: { q: query.value } });
        });
}

function formatDate(timestamp: Date) {
    return timestamp ? new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) :"";
}

const isModalOpened = ref(false);
const openModal = () => {
    isModalOpened.value = true;
};
const closeModal = () => {
    isModalOpened.value = false;
};

onMounted(() => {
    if (route.query.q) {
        query.value = route.query.q as string;
        fetchData();
    }
});

</script>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}
th,
td {
    border: 1px solid var(--color-primary);
    padding: 10px;
    text-align: left;
}

th {
    background-color: #010101;
}
.resource {
    border: 1px solid #000;
    box-shadow: 0 25px 50px -12px var(--color-primary-shadow);
}

.searchBox {
    border: 3px solid var(--color-primary);
    font-size: 3rem;
    border-radius: .5rem;
    padding: .5rem 1rem;
    margin: 20px auto;
    font-family: inherit;
    outline: none;
    box-shadow: 0 20px 20px -20px var(--color-primary-shadow);
    background: var(--color-background);
    color: var(--color-text);
}

.inputContainer {
    text-align: center;
}
.settingsIcon{
    padding-left:10px;
    height:40px;
    width:40px;
    color: var(--color-primary);
}
.settingsIcon:hover{
    cursor: pointer;
}
</style>