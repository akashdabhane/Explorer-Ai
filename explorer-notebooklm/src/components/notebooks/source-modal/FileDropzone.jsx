import UploadActions from "./UploadActions";

export default function FileDropzone() {
  return (
    <section className="px-6 pb-6 mt-6">
      <div className="rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12">
        <div className="mx-auto max-w-xl text-center">
          <h3 className="text-3xl font-medium text-white">
            or drop your files
          </h3>

          <p className="mt-3 text-lg text-zinc-400">
            pdf, images, docs, audio,{" "}
            <span className="cursor-pointer underline underline-offset-2">
              and more
            </span>
          </p>

          <UploadActions />
        </div>
      </div>
    </section>
  );
}