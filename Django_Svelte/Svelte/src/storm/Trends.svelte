<script lang="ts">
import {updateTrendVisibility} from './trends'
import { storms } from "../store";

  $: updateTrendVisibility($storms);
</script>
