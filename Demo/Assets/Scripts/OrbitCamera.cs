using UnityEngine;

public class OrbitCamera : MonoBehaviour
{
    public float rotationSpeed = 1.5F;

    [SerializeField]
    private Transform target;

    private float rotationY;

    private Vector3 offset;

    void Start()
    {
        rotationY = transform.eulerAngles.y;
        offset = target.position - transform.position;
    }

    void LateUpdate()
    {
        var horizonalInput = Input.GetAxis("Horizontal");
        if (horizonalInput != 0)
        {
            rotationY += horizonalInput * rotationSpeed;
        }
        else
        {
            rotationY += Input.GetAxis("Mouse X") * rotationSpeed * 3;
        }

        var rotation = Quaternion.Euler(0.0F, rotationY, 0.0F);
        transform.position = target.position - (rotation * offset);
        transform.LookAt(target);
    }
}
