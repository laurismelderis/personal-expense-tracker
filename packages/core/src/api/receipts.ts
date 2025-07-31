import { supabase } from '../lib/supabase'

export const fetchUploadReceipt = async ({
  userId,
  file,
}: {
  userId: string
  file: File
}): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('receipts')
    .upload(fileName, file)

  if (!error && data) {
    return fileName
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to upload receipt')
}
