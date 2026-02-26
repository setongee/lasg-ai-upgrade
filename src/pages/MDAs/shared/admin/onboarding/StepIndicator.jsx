{
  /* step indicator */
}
<div className="w-[380px]">
  <div className="flex items-center gap-2 cursor-pointer" onClick={() => goToStep(1)}>
    <div
      className={`w-4 h-4 border-2 rounded-[50%] ${
        currentStep === 1 ? 'border-green-600 bg-green-100' : 'border-gray-400 bg-gray-100'
      }`}
    ></div>
    <p className={`${currentStep === 1 ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
      Summary
    </p>
  </div>
  <div
    className={`w-full h-10 border-l-1 ml-[7px] border-dashed ${
      currentStep >= 2 ? 'border-green-600' : 'border-gray-400'
    }`}
  ></div>

  <div className="flex items-center gap-2">
    <div
      className={`w-4 h-4 border-2 rounded-[50%] ${
        currentStep === 2
          ? 'border-green-500 bg-green-500'
          : currentStep > 2
            ? 'border-green-500 bg-green-500'
            : 'border-gray-400 bg-gray-100'
      }`}
    ></div>
    <p
      className={`${
        currentStep === 2
          ? 'text-green-600 font-semibold'
          : currentStep > 2
            ? 'text-green-600'
            : 'text-gray-700'
      }`}
    >
      Select Theme
    </p>
  </div>
  <div
    className={`w-full h-10 border-l-1 ml-[7px] border-dashed ${
      currentStep >= 3 ? 'border-green-500' : 'border-gray-400'
    }`}
  ></div>

  <div className="flex items-center gap-2">
    <div
      className={`w-4 h-4 border-2 rounded-[50%] ${
        currentStep === 3 ? 'border-green-500 bg-green-500' : 'border-gray-400 bg-gray-100'
      }`}
    ></div>
    <p className={`${currentStep === 3 ? 'text-green-600 font-semibold' : 'text-gray-700'}`}>
      Generate Content
    </p>
  </div>
</div>;
