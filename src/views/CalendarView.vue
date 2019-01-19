<template>
	<calendar-view
	:show-date="showDate"
	:events="eventsProp"
	@click-event="clickEvent"

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
	require("vue-simple-calendar/static/css/default.css")
	require("vue-simple-calendar/static/css/holidays-us.css")

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
			clickEvent(e) {
			console.log(`You clicked: ${e.title}`)
			this.$store.commit("setEvent", e.id)
			this.$router.push({"path" : "/event/info"})


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