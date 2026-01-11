<script setup lang="ts">
import { NCard, NGrid, NGi, NText, NThing } from 'naive-ui'
</script>

<template>
	<div class="space-y-4">
		<div>
			<n-text strong>
				Welcome to NextHome
			</n-text>
			<div class="mt-2">
				<n-text depth="3">
					NextHome is built for immigrants who want to share real experience of living abroad and
					quickly find practical answers from people who have already been through similar situations.
				</n-text>
			</div>
		</div>

		<n-grid cols="1 m:2" x-gap="16" y-gap="16" item-responsive>
			<n-gi>
				<n-card title="My experience">
					<n-thing>
						<template #description>
							Share what you did, what worked, what didn’t, and what you wish you knew earlier.
							Your story becomes useful guidance for others.
						</template>
					</n-thing>
				</n-card>
			</n-gi>

			<n-gi>
				<n-card title="My pain point">
					<n-thing>
						<template #description>
							Describe your problem or struggle. NextHome helps you find answers based on experiences
							shared by other users before.
						</template>
					</n-thing>
				</n-card>
			</n-gi>
		</n-grid>
	</div>
</template>

