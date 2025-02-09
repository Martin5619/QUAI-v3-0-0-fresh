'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface VideoModalProps {
  isOpen: boolean
  closeModal: () => void
  videoUrl: string
  videoType: 'youtube' | 'direct'
}

function getYoutubeId(url: string) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export default function VideoModal({ isOpen, closeModal, videoUrl, videoType }: VideoModalProps) {
  const youtubeId = videoType === 'youtube' ? getYoutubeId(videoUrl) : null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="aspect-video w-full">
                  {videoType === 'youtube' && youtubeId ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : videoType === 'direct' && videoUrl ? (
                    <video
                      className="w-full h-full"
                      controls
                      src={videoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                      No video available
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
