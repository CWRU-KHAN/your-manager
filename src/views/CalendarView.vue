<template>
	<calendar-view
	:show-date="showDate"
	:events="eventsProp"

	class="theme-default">
	<calendar-view-header
		slot="header"
		slot-scope="t"
		:header-props="t.headerProps"
		@input="setShowDate" 
		/>

</calendar-view>
</template>
<script>
	import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
	// The next two lines are processed by webpack. If you're using the component without webpack compilation,
	// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.
	require("vue-simple-calendar/static/css/default.css")
	require("vue-simple-calendar/static/css/holidays-us.css")


// //////get rid of this json once we start passing it actual data
// 	const eventsJSON = [
// 		{
// 			id: 0,
// 			startDate: '2019-01-10 12:00:00',
// 			title: 'go to the park'

// 		},
// 		{
// 			id: 1,
// 			startDate: '2019-01-11 12:00:00',
// 			title: 'does this work?'
// 		}
// 	]

	export default {
		props: [
			"eventsProp"
		],
		
		components: {
			CalendarView,
			CalendarViewHeader
		},

		data() {
			return {
				showDate: new Date()
			}
		},
		
		methods: {
			setShowDate(d) {
				this.showDate = d;
			},
		}
		
	}
</script>
<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		color: #2c3e50;
		height: 67vh;
		width: 90vw;
		margin-left: auto;
		margin-right: auto;
	}
</style>