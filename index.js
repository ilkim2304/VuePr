Notification.requestPermission()

const { createApp, onMounted, reactive, computed } = Vue
const dateFormat = time => new Date(new Date(time) - new Date(time).getTimezoneOffset() * 60000).toISOString().substring(0, 16)

const test = [{ title: 'test', description: 'test'}]

const setup = () => {
  const localItems = localStorage.getItem('notifications')

  const initItems = localItems ? JSON.parse(localItems) : test


  const items = reactive(initItems)
  const edited = reactive({
    index: -1,
    item: { title: '', description: '', time: 0, timeValue: '' }
  })
  const editTitle = computed(() => {
    return edited.index === -1 ? 'Добавить уведомление' : 'Изменить уведомление'
  })

  const save = () => {
    const item = {
      title: edited.item.title,
      description: edited.item.description,
      time: new Date(edited.item.timeValue).getTime(),
      timeValue: edited.item.timeValue,
      viewed: false,
    }
    if (edited.index === -1) {
      items.push(item)

    } else {
      items[edited.index] = item
    }

    localStorage.setItem('notifications', JSON.stringify(items))
    cancel()
  }
  const cancel = () => {
    edited.index = -1
    for (var el in edited.item) {
      delete edited.item[el];
    }
  }

  const remove = i => {
    items.splice(i, 1)
    localStorage.setItem('notifications', JSON.stringify(items))
  }

  const edit = i => {
    edited.index = i
    edited.item = JSON.parse(JSON.stringify(items[i]))
  }

  const notification = () => {
    for (let i = 0; i < items.length; i++) {
      const now = Date.now()
      const time = items[i].time
      const title = items[i].title
      const description = items[i].description
      const viewed = items[i].viewed

      if (now > time && !viewed) {
        new Notification(title, {
          body: description,
        })
        items[i].viewed = true
        break;
      }

    }
  }

  onMounted(() => {
    setInterval(function () {
      notification()

    }, 2000)
  })

  return {
    items,
    editTitle,
    edited,

    remove,
    edit,
    cancel,
    save
  }
}

createApp({ setup }).mount('#app')
